const Listing = require("./models/listing.js");
const Review = require("./models/reviews.js");

const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");


module.exports.isLoggedIn = (req, res, next) => {
        if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl; //originalurl
        req.flash("error", "You must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
   
    next();
}

module.exports.isOwner = async (req, res, next) => {
         const { id } = req.params;
        const listing = await Listing.findById(id);

        if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
       }
   
        if (!listing.owner || !listing.owner.equals(req.user._id)) {
        req.flash("error", "You are not the owner");
        return res.redirect(`/listings/${id}`);
        }

        next();
}



//validation for create route
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else {
        next();
    }
};

//validation for review
module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else {
        next();
    }
};

module.exports.isReviewAuthor = async (req, res, next) => {
         const { id, reviewId } = req.params;
        const review = await Review.findById(reviewId);

        if (!review.author || !review.author.equals(req.user._id)) {
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
        }

        next();
}