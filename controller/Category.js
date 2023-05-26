const CustomAPIError = require("../errors/custom-error");
const { asyncWrapper } = require("../middleware/async");
const Category = require("../models/Category");

const addCategory = asyncWrapper(async (req, res) => {
  const category = await Category.create(req.body);
  return res.status(200).json({ category });
});

const getCategory = asyncWrapper(async (req, res) => {
  const categories = await Category.find({});
  return res
    .status(200)
    .json({ categories: categories, nbHits: categories.length });
});

const updateCategory = asyncWrapper(async (req, res) => {
  const { catId: id } = req.params;
  const { categoryName } = req.body;
  const category = await Category.findOneAndUpdate(
    { _id: catId },
    { category: categoryName }
  );

  if (!category) {
    throw new CustomAPIError(`No category with id: ${catId}`, 404);
  }

  return res.status(400).json(category);
});
const deleteCategory = asyncWrapper(async (req, res) => {
  const { catId: id } = req.params;
  const category = await Category.findOneAndDelete({ _id: catId });

  if (!category) {
    throw new CustomAPIError(`No category with id: ${catId}`, 404);
  }

  return res.status(400).send("Category deleted successfully");
});

module.exports = { addCategory, getCategory, updateCategory, deleteCategory };
