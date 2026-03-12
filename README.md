Ho va ten: Nguyễn Thanh Hải
MSSV 2280606915

# User & Role API

## Cài đặt

```bash
npm install
```

## Chạy server

```bash
npm start
```

Hoặc chế độ development:
```bash
npm run dev
```

## API Endpoints

### ROLE API

#### 1. Tạo Role mới
**POST** `/api/roles`

```json
{
  "name": "Admin",
  "description": "Quản trị viên"
}
```

#### 2. Lấy tất cả Roles
**GET** `/api/roles`

#### 3. Lấy Role theo ID
**GET** `/api/roles/:id`

#### 4. Cập nhật Role
**PUT** `/api/roles/:id`

```json
{
  "name": "SuperAdmin",
  "description": "Quản trị viên cấp cao"
}
```

#### 5. Xoá mềm Role
**DELETE** `/api/roles/:id`

---

### USER API

#### 1. Tạo User mới
**POST** `/api/users`

```json
{
  "username": "john_doe",
  "password": "securepassword123",
  "email": "john@example.com",
  "fullName": "John Doe",
  "role": "role_id_here"
}
```

#### 2. Lấy tất cả Users
**GET** `/api/users`

#### 3. Lấy User theo ID
**GET** `/api/users/:id`

#### 4. Cập nhật User
**PUT** `/api/users/:id`

```json
{
  "fullName": "John Updated",
  "email": "newemail@example.com"
}
```

#### 5. Xoá mềm User
**DELETE** `/api/users/:id`

#### 6. Kích hoạt User (Enable)
**POST** `/api/users/enable`

```json
{
  "email": "john@example.com",
  "username": "john_doe"
}
```

Thay đổi status sang `true`

#### 7. Vô hiệu hóa User (Disable)
**POST** `/api/users/disable`

```json
{
  "email": "john@example.com",
  "username": "john_doe"
}
```

Thay đổi status sang `false`

---

## Cấu trúc Dữ liệu

### Role
- `name` (String, required, unique): Tên role
- `description` (String, default: ""): Mô tả
- `isDeleted` (Boolean, default: false): Trạng thái xoá mềm
- `timestamps`: Ngày tạo và cập nhật

### User
- `username` (String, required, unique): Tên đăng nhập
- `password` (String, required): Mật khẩu (được hash)
- `email` (String, required, unique): Email
- `fullName` (String, default: ""): Họ tên
- `avatarUrl` (String, default: "https://i.sstatic.net/l60Hf.png"): URL ảnh đại diện
- `status` (Boolean, default: false): Trạng thái (kích hoạt/không kích hoạt)
- `role` (ObjectID, ref: 'Role'): Tham chiếu đến Role
- `loginCount` (Number, default: 0, min: 0): Số lần đăng nhập
- `isDeleted` (Boolean, default: false): Trạng thái xoá mềm
- `timestamps`: Ngày tạo và cập nhật
