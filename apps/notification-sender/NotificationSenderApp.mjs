import path from "path";
import {
	AbstractAdminizerApp,
} from "adminizer";

export class NotificationSenderApp extends AbstractAdminizerApp {
	name = "notification-sender";
	version = "1.0.0";
	config;

	constructor(config = {}) {
		super();
		this.config = {
			route: "/notification-sender",
			sidebarId: "notification-sender",
			title: "Notification Sender",
			icon: "360",
			section: "Platform",
			componentFile: path.resolve(import.meta.dirname, "NotificationSender.es.js"),
			devComponentUrl: "",
			...config,
		};
	}

	setup(ctx) {
		ctx.modelAccess({
			id: "users",
			models: ["UserAP"],
		});

		const moduleComponent = ctx.asset({
			id: "component",
			filePath: this.config.componentFile,
			devUrl: this.config.devComponentUrl,
		});

		const pageUrl = ctx.controller({
			id: "page",
			method: "get",
			route: this.config.route,
			middleware: this.renderModule(moduleComponent),
			policies: [{type: "auth", mode: "ui"}],
		});

		ctx.controller({
			id: "send-notification",
			method: "post",
			route: this.config.route,
			middleware: this.sendNotification,
			policies: [{type: "auth", mode: "api"}],
		});

		ctx.config({
			navbar: {
				additionalLinks: [{
					id: this.config.sidebarId,
					link: pageUrl,
					type: "self",
					title: this.config.title,
					icon: this.config.icon,
					section: this.config.section,
				}],
			},
		});
	}

	renderModule(moduleComponent) {
		return async (req, res) => {
			const users = await req.runtime.models.get("UserAP").find({});

			return req.Inertia.render({
				component: "module",
				props: {
					moduleComponent,
					data: {
						users,
					},
				},
			});
		};
	}

	sendNotification = async (req, res) => {
		const rawUserId = req.body.userId;
		const userId = req.body.sendToAll ? undefined : Number(rawUserId);

		if (!req.body.sendToAll && (!Number.isInteger(userId) || userId <= 0)) {
			return res.status(400).json({
				error: "Invalid userId",
			});
		}

		await req.runtime.notifications.send({
			title: "User message",
			message: req.body.message,
			notificationClass: "general",
			channel: "",
			...(userId ? {userId} : {}),
		});

		return res.json({
			data: req.body,
		});
	};
}
