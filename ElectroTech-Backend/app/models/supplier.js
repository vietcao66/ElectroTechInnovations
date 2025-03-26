const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const SupplierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    contactPerson: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default:
        "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png",
    },
    // Thêm các trường khác tùy ý
  },
  { timestamps: true },
  { collection: "supplier" }
);

SupplierSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Supplier", SupplierSchema);
