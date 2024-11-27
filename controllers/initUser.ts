export default async function initUser(req: ReqType, res: ResType) {
  if (!adminizer.config.auth) {
    return res.redirect(`${adminizer.config.routePrefix}/`);
  }

  let admins = await UserAP.find({ isAdministrator: true });
  if (admins.length) {
    res.redirect(`${adminizer.config.routePrefix}/model/userap/login`);
  }

  if (req.method.toUpperCase() === "POST") {
    let login = req.param("login");
    let locale = req.param("locale");
    let password = req.param("password");
    let confirm_password = req.param("confirm_password");

    adminizer.log.debug(login, password, confirm_password, 123)
    if (password !== confirm_password) {
      req.session.messages.adminError.push("Password mismatch");
      return res.viewAdmin("init_user");
    }

    try {
      adminizer.log.debug(`Created admin`)
      await UserAP.create(
        {
          login: login,
          password: password,
          fullName: "Administrator",
          isActive: true,
          ...(locale !== undefined && { locale }),
          isAdministrator: true
        }
      );
    } catch (e) {
      adminizer.log.error("Could not create administrator profile", e)
      req.session.messages.adminError.push("Could not create administrator profile");
      return res.viewAdmin("init_user");
    }

    return res.redirect(`${adminizer.config.routePrefix}/`);
  }

  if (req.method.toUpperCase() === "GET") {
    return res.viewAdmin("init_user");
  }
};
