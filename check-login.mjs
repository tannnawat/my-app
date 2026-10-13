import bcrypt from "bcryptjs";

const hash = "$2b$10$HIdtkxd4EFpo7PBOP/mSIuckYLW01PLKAx1HaB9hxv7UPpQsGq7qu";

console.log(
  "รหัสผ่านตรง:",
  await bcrypt.compare("ChangeMe123!", hash)
);
