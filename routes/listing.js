const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const multer = require('multer');
const {storage} = require("../cloudConfigu.js")
const upload = multer({ storage });

const listingController = require("../controllers/listings.js");

//index  route
//create route
router
     .route("/")
     .get(
          wrapAsync(listingController.index))
     .post(
          isLoggedIn,
           validateListing,
           upload.single("listing[image]"),
           wrapAsync(listingController.createListings)
          );
  


//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

//Show route
//update route
//delete route
router
     .route("/:id")
     .get(
          wrapAsync(listingController.showListing))
     .put(
          isLoggedIn,
          isOwner,
          upload.single("listing[image]"),
          validateListing,
          wrapAsync(listingController.updateListings))
     .delete(
    isLoggedIn,
    isOwner,
     wrapAsync(listingController.deleteListings));



// edit route
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
     wrapAsync(listingController.editForm));





module.exports = router;
