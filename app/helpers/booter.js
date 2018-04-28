/**
 * Created by adrianaldairleyvasanchez on 4/27/18.
 */
module.exports = function (app, mongoose) {
    //require("../routes/feed/post-img")(app, mongoose);
    //require("../routes/feed/delete-post")(app, mongoose);

    require("../routes/friend/follow")(app, mongoose);
    //require("../routes/friend/unfollow")(app, mongoose);

    require("../routes/profile/show-profile")(app, mongoose);

    require("../routes/session/sign-up")(app, mongoose);
    require("../routes/session/login")(app, mongoose);
    require("../routes/session/logout")(app, mongoose);
};