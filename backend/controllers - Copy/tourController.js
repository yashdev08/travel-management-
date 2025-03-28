import Tour from "../models/Tour.js";

const getAllTours = async (req, res) => {
  const page = parseInt(req.query.page) || 0;
  if (isNaN(page) || page < 0) {
    return res.status(400).json({ success: false, message: "Invalid page number" });
  }

  try {
    const tours = await Tour.find()
      .sort({ createdAt: -1 })
      .populate("reviews")
      .skip(page * 12)
      .limit(12);

    res.status(200).json({ success: true, data: tours, count: tours.length });
  } catch (error) {
    console.error("Error fetching tours:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getSingleTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id).populate("reviews");
    if (!tour) {
      return res.status(404).json({ success: false, message: "Tour not found" });
    }
    res.status(200).json({ success: true, data: tour });
  } catch (error) {
    console.error("Error fetching tour:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const createTour = async (req, res) => {
  try {
    const newTour = new Tour(req.body);
    await newTour.save();
    res.status(201).json({ success: true, message: "Tour created successfully", data: newTour });
  } catch (error) {
    console.error("Error creating tour:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTour) {
      return res.status(404).json({ success: false, message: "Tour not found" });
    }
    res.status(200).json({ success: true, message: "Tour Updated Successfully", data: updatedTour });
  } catch (error) {
    console.error("Error updating tour:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const deleteTour = async (req, res) => {
  try {
    const deletedTour = await Tour.findByIdAndDelete(req.params.id);
    if (!deletedTour) {
      return res.status(404).json({ success: false, message: "Tour not found" });
    }
    res.status(200).json({ success: true, message: "Tour deleted successfully" });
  } catch (error) {
    console.error("Error deleting tour:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getTourBySearch = async (req, res) => {
  try {
    const searchTerm = req.query.search;
    const minPrice = parseInt(req.query.minPrice);
    const maxPrice = parseInt(req.query.maxPrice);

    if (!searchTerm && isNaN(minPrice) && isNaN(maxPrice)) {
      return res.status(400).json({ success: false, message: "Provide a search term or price range" });
    }

    const searchCriteria = {};
    if (searchTerm) {
      searchCriteria.$or = [
        { title: { $regex: new RegExp(searchTerm, "i") } },
        { city: { $regex: new RegExp(searchTerm, "i") } },
      ];
    }
    if (!isNaN(minPrice) && !isNaN(maxPrice)) {
      searchCriteria.price = { $gte: minPrice, $lte: maxPrice };
    }

    const matchingTours = await Tour.find(searchCriteria).populate("reviews");
    res.status(200).json({ success: true, data: matchingTours, count: matchingTours.length });
  } catch (error) {
    console.error("Error searching tours:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getFeaturedTour = async (req, res) => {
  try {
    const featuredTours = await Tour.find({ featured: true })
      .sort({ createdAt: -1 })
      .populate("reviews")
      .limit(12);
    res.status(200).json({ success: true, data: featuredTours, count: featuredTours.length });
  } catch (error) {
    console.error("Error fetching featured tours:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getTourCount = async (req, res) => {
  try {
    const tourCount = await Tour.countDocuments();
    res.status(200).json({ success: true, data: tourCount });
  } catch (error) {
    console.error("Error counting tours:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export {
  getAllTours,
  getSingleTour,
  createTour,
  updateTour,
  deleteTour,
  getTourBySearch,
  getFeaturedTour,
  getTourCount,
};
