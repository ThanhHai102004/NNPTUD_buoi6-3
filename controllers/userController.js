const User = require('../models/User');

// CREATE - Tạo user mới
exports.createUser = async (req, res) => {
  try {
    const { username, password, email, fullName, role } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username, password và email là bắt buộc' 
      });
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser && !existingUser.isDeleted) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username hoặc email đã tồn tại' 
      });
    }

    const user = new User({
      username,
      password,
      email,
      fullName,
      role
    });

    await user.save();

    // Không trả về password
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({ 
      success: true, 
      message: 'Tạo user thành công', 
      data: userResponse 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// READ - Lấy tất cả user (không tính các user bị xoá mềm)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ isDeleted: false })
      .select('-password')
      .populate('role');
    
    res.status(200).json({ 
      success: true, 
      data: users 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// READ - Lấy user theo ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password').populate('role');

    if (!user || user.isDeleted) {
      return res.status(404).json({ 
        success: false, 
        message: 'User không tồn tại' 
      });
    }

    res.status(200).json({ 
      success: true, 
      data: user 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// UPDATE - Cập nhật user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, fullName, role, password } = req.body;

    const user = await User.findById(id);
    if (!user || user.isDeleted) {
      return res.status(404).json({ 
        success: false, 
        message: 'User không tồn tại' 
      });
    }

    // Kiểm tra username và email không trùng
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser && !existingUser.isDeleted) {
        return res.status(400).json({ 
          success: false, 
          message: 'Username đã tồn tại' 
        });
      }
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && !existingUser.isDeleted) {
        return res.status(400).json({ 
          success: false, 
          message: 'Email đã tồn tại' 
        });
      }
    }

    const updateData = { username, email, fullName, role };
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password').populate('role');

    res.status(200).json({ 
      success: true, 
      message: 'Cập nhật user thành công', 
      data: updatedUser 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// DELETE - Xoá mềm user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user || user.isDeleted) {
      return res.status(404).json({ 
        success: false, 
        message: 'User không tồn tại' 
      });
    }

    const deletedUser = await User.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    ).select('-password');

    res.status(200).json({ 
      success: true, 
      message: 'Xoá user thành công', 
      data: deletedUser 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// POST - Kích hoạt user (enable)
exports.enableUser = async (req, res) => {
  try {
    const { email, username } = req.body;

    if (!email || !username) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email và username là bắt buộc' 
      });
    }

    const user = await User.findOne({ 
      email, 
      username, 
      isDeleted: false 
    });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User không tồn tại hoặc thông tin không chính xác' 
      });
    }

    const enabledUser = await User.findByIdAndUpdate(
      user._id,
      { status: true },
      { new: true }
    ).select('-password');

    res.status(200).json({ 
      success: true, 
      message: 'Kích hoạt user thành công', 
      data: enabledUser 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// POST - Vô hiệu hóa user (disable)
exports.disableUser = async (req, res) => {
  try {
    const { email, username } = req.body;

    if (!email || !username) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email và username là bắt buộc' 
      });
    }

    const user = await User.findOne({ 
      email, 
      username, 
      isDeleted: false 
    });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User không tồn tại hoặc thông tin không chính xác' 
      });
    }

    const disabledUser = await User.findByIdAndUpdate(
      user._id,
      { status: false },
      { new: true }
    ).select('-password');

    res.status(200).json({ 
      success: true, 
      message: 'Vô hiệu hóa user thành công', 
      data: disabledUser 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};
