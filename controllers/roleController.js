const Role = require('../models/Role');

// CREATE - Tạo role mới
exports.createRole = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ 
        success: false, 
        message: 'Tên role là bắt buộc' 
      });
    }

    const existingRole = await Role.findOne({ name });
    if (existingRole && !existingRole.isDeleted) {
      return res.status(400).json({ 
        success: false, 
        message: 'Role này đã tồn tại' 
      });
    }

    const role = new Role({
      name,
      description
    });

    await role.save();
    res.status(201).json({ 
      success: true, 
      message: 'Tạo role thành công', 
      data: role 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// READ - Lấy tất cả role (không tính các role bị xoá mềm)
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find({ isDeleted: false });
    res.status(200).json({ 
      success: true, 
      data: roles 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// READ - Lấy role theo ID
exports.getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findById(id);

    if (!role || role.isDeleted) {
      return res.status(404).json({ 
        success: false, 
        message: 'Role không tồn tại' 
      });
    }

    res.status(200).json({ 
      success: true, 
      data: role 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// UPDATE - Cập nhật role
exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const role = await Role.findById(id);
    if (!role || role.isDeleted) {
      return res.status(404).json({ 
        success: false, 
        message: 'Role không tồn tại' 
      });
    }

    // Kiểm tra tên role không trùng
    if (name && name !== role.name) {
      const existingRole = await Role.findOne({ name });
      if (existingRole && !existingRole.isDeleted) {
        return res.status(400).json({ 
          success: false, 
          message: 'Tên role đã tồn tại' 
        });
      }
    }

    const updatedRole = await Role.findByIdAndUpdate(
      id,
      { name, description },
      { new: true, runValidators: true }
    );

    res.status(200).json({ 
      success: true, 
      message: 'Cập nhật role thành công', 
      data: updatedRole 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// DELETE - Xoá mềm role
exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findById(id);
    if (!role || role.isDeleted) {
      return res.status(404).json({ 
        success: false, 
        message: 'Role không tồn tại' 
      });
    }

    const deletedRole = await Role.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    res.status(200).json({ 
      success: true, 
      message: 'Xoá role thành công', 
      data: deletedRole 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};
