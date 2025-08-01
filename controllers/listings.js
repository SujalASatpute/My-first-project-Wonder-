const Listing = require("../models/listing.js");

module.exports.index = async(req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm =  (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async(req, res) => {
    let { id } = req.params;
   const listing = await Listing.findById(id)
   .populate({
     path: "reviews",
     populate: {
        path: "author"
        },
     })
   .populate("owner");
   if(!listing){
        req.flash("error", "Listing you requested for dors not exist");
        res.redirect("/listings");
   }
   console.log(listing);
   
   
   res.render("listings/show.ejs", { listing });

};

module.exports.createListings = async (req, res,next) => {
        let url = req.file.path;
        let filename = req.file.filename;
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id; //save the current user name saved to listing
        newListing.image = { url, filename };
        await newListing.save();
        req.flash("success", "New Listing created");
        res.redirect("/listings");
 
};

module.exports.editForm = async(req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
       if(!listing){
        req.flash("error", "Listing you requested for dors not exist");
        res.redirect("/listings");
   }

   let orignalImageUrl = listing.image.url;
   orignalImageUrl = orignalImageUrl.replace("/upload", "/upload/w_250");//blur low quality image
    res.render("listings/edit.ejs", { listing, orignalImageUrl });
};

module.exports.updateListings = async(req, res) => {
        let { id } = req.params;
        let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

        if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
        }

        req.flash("success", "Listing Updated");
        res.redirect("/listings");
};

module.exports.deleteListings = async(req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
};
