exports.createHTML = (req, res, next) => {
    
    if (req.session.authenticated) {

		res.render(
			'index',
			{
				leftbutton: "Members Page",
				leftbuttonLink: "/member",
				log: "Logout",
				logLink: "/logout",
				isUser: `, ${req.session.username}!`
			}
		);

	} else {

		res.render(
			'index',
			{
				leftbutton: "Sign Up",
				leftbuttonLink: "/signup",
				log: "Log-In",
				logLink: "/login",
				isUser: " to the Member Tracker Site!"
			}
		);
	}
};