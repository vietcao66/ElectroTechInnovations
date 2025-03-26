const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    slug: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default:
        "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png",
    },
  },
  { timestamps: true },
  { collection: "category" }
);

CategorySchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Category", CategorySchema);
