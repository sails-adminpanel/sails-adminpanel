export default async function register(req: ReqTypeAP, res: ResTypeAP) {
  if (!adminizer.config.auth || adminizer.config.registration?.enable !== true) {
    return res.redirect(`${adminizer.config.routePrefix}/`);
  }

  if (req.method.toUpperCase() === "POST") {
    console.log("req.body", req.body);

    if (!req.body.login || !req.body.fullName || !req.body.password) {
      return res.serverError("Missing required parameters");
    }

    let user;
    try {
      user = await UserAP.findOne({ login: req.body.login });
    } catch (e) {
      return res.serverError(e);
    }

    if (user) {
      req.session.messages.adminError.push("This login is already registered, please try another one");
      return res.viewAdmin("register");
    } else {
      try {
        let userap = await UserAP.create({ login: req.body.login, password: req.body.password,
          fullName: req.body.fullName, email: req.body.email, locale: req.body.locale }).fetch();
        let defaultUserGroup = await GroupAP.find({name: adminizer.config.registration.defaultUserGroup});
        // TODO move UserAP to abstract model
        // @ts-ignore
        await UserAP.addToCollection(userap.id, "groups").members([defaultUserGroup.id]);

        return res.redirect(`${adminizer.config.routePrefix}/`);
      } catch (e) {
        return res.serverError(e);
      }
    }
  }

  if (req.method.toUpperCase() === "GET") {
    return res.viewAdmin("register");
  }
};
