/**
 * This file is part of OpenMediaVault.
 *
 * @license   http://www.gnu.org/licenses/gpl.html GPL Version 3
 * @author    Volker Theile <volker.theile@openmediavault.org>
 * @copyright Copyright (c) 2009-2015 Volker Theile
 *
 * OpenMediaVault is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 *
 * OpenMediaVault is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with OpenMediaVault. If not, see <http://www.gnu.org/licenses/>.
 */
// require("js/omv/WorkspaceManager.js")
// require("js/omv/workspace/grid/Panel.js")
// require("js/omv/workspace/window/Form.js")
// require("js/omv/workspace/window/Grid.js")
// require("js/omv/workspace/window/Tab.js")
// require("js/omv/workspace/window/TextArea.js")
// require("js/omv/form/Panel.js")
// require("js/omv/form/field/CheckboxGrid.js")
// require("js/omv/form/field/Password.js")
// require("js/omv/grid/PrivilegesByRole.js")
// require("js/omv/util/Format.js")
// require("js/omv/Rpc.js")
// require("js/omv/data/Store.js")
// require("js/omv/data/Model.js")
// require("js/omv/data/proxy/Rpc.js")
// require("js/omv/data/reader/RpcArray.js")

/**
 * @class OMV.module.admin.privilege.user.user.General
 * @derived OMV.form.Panel
 */
Ext.define("OMV.module.admin.privilege.user.user.General", {
	extend: "OMV.form.Panel",
	uses: [
		"OMV.data.Store",
		"OMV.data.Model",
		"OMV.data.proxy.Rpc",
		"OMV.data.reader.RpcArray",
		"OMV.form.field.Password"
	],

	title: _("General"),
	bodyPadding: "5 5 0",

	initComponent: function() {
		var me = this;
		Ext.apply(me, {
			items: [{
				xtype: "textfield",
				name: "name",
				fieldLabel: _("Name"),
				allowBlank: false,
				vtype: "username",
				readOnly: "edit" == me.displayMode
			},{
				xtype: "textfield",
				name: "comment",
				fieldLabel: _("Comment"),
				maxLength: 65,
				vtype: "comment"
			},{
				xtype: "textfield",
				name: "email",
				fieldLabel: _("Email"),
				allowBlank: true,
				vtype: "email"
			},{
				xtype: "passwordfield",
				name: "password",
				fieldLabel: _("Password"),
				allowBlank: "edit" == me.displayMode
			},{
				xtype: "passwordfield",
				name: "passwordconf",
				fieldLabel: _("Confirm password"),
				allowBlank: "edit" == me.displayMode,
				submitValue: false
			},{
				xtype: "combo",
				name: "shell",
				fieldLabel: _("Shell"),
				allowBlank: false,
				editable: false,
				triggerAction: "all",
				store: Ext.create("OMV.data.Store", {
					autoLoad: true,
					fields: [
						{ name: "path", type: "string" }
					],
					proxy: {
						type: "rpc",
						reader: "rpcarray",
						appendSortParams: false,
						rpcData: {
							service: "System",
							method: "getShells"
						}
					},
					sorters: [{
						direction: "ASC",
						property: "path"
					}]
				}),
				emptyText: _("Select a shell ..."),
				valueField: "path",
				displayField: "path",
				value: "/bin/dash"
			},{
				xtype: "checkbox",
				name: "disallowusermod",
				fieldLabel: _("Modify account"),
				checked: false,
				boxLabel: _("Disallow the user to modify his account.")
			}]
		});
		me.callParent(arguments);
	},

	isValid: function() {
		var me = this;
		if (!me.callParent(arguments))
			return false;
		var valid = true;
		var values = me.getValues();
		// Check the password.
		var field = me.findField("passwordconf");
		if (values.password !== field.getValue()) {
			var msg = _("Passwords don't match");
			me.markInvalid([
				{ id: "password", msg: msg },
				{ id: "passwordconf", msg: msg }
			]);
			valid = false;
		}
		return valid;
	}
});

/**
 * @class OMV.module.admin.privilege.user.user.Groups
 * @derived OMV.form.Panel
 */
Ext.define("OMV.module.admin.privilege.user.user.Groups", {
	extend: "OMV.form.Panel",
	uses: [
		"OMV.data.Store",
		"OMV.data.Model",
		"OMV.data.proxy.Rpc",
		"OMV.form.field.CheckboxGrid"
	],

	title: _("Groups"),
	bodyPadding: "5 5 0",
	layout: {
		type: "vbox",
		align: "stretch"
	},

	initComponent: function() {
		var me = this;
		Ext.apply(me, {
			items: [{
				xtype: "checkboxgridfield",
				name: "groups",
				fieldLabel: _("Groups"),
				hideLabel: true,
				valueField: "name",
				flex: 1,
				store: Ext.create("OMV.data.Store", {
					autoLoad: true,
					model: OMV.data.Model.createImplicit({
						idProperty: "name",
						fields: [
							{ name: "name", type: "string" },
							{ name: "system", type: "boolean" }
						]
					}),
					proxy: {
						type: "rpc",
						appendSortParams: false,
						rpcData: {
							service: "UserMgmt",
							method: "enumerateAllGroups"
						}
					},
					sorters: [{
						direction: "ASC",
						property: "name"
					}]
				}),
				gridConfig: {
					stateful: true,
					stateId: "e44f12ea-b1ed-11e2-9a57-00221568ca88",
					columns: [{
						text: _("Name"),
						sortable: true,
						dataIndex: "name",
						stateId: "name",
						flex: 2
					},{
						xtype: "booleantextcolumn",
						text: _("System"),
						sortable: true,
						dataIndex: "system",
						stateId: "system",
						align: "center",
						hidden: true,
						flex: 1
					}]
				},
				value: [ "users" ]
			}]
		});
		me.callParent(arguments);
	}
});

/**
 * @class OMV.module.admin.privilege.user.user.sshpubkeys.PubKey
 * @derived OMV.workspace.window.TextArea
 */
Ext.define("OMV.module.admin.privilege.user.user.sshpubkeys.PubKey", {
	extend: "OMV.workspace.window.TextArea",

	width: 500,
	height: 250,
	hideOkButton: false,
	mode: "local",
	readOnly: false,

	initComponent: function() {
		var me = this;
		me.callParent(arguments);
		// Add the tip toolbar at the bottom of the window.
		me.addDocked({
			xtype: "tiptoolbar",
			dock: "bottom",
			ui: "footer",
			text: _("The public key in RFC 4716 SSH public key file format.")
		});
	},

	getTextAreaConfig: function(c) {
		return {
			allowBlank: false,
			vtype: "sshPubKeyRFC4716"
		};
	}
});

/**
 * @class OMV.module.admin.privilege.user.user.SshPubKeys
 * @derived OMV.workspace.grid.Panel
 */
Ext.define("OMV.module.admin.privilege.user.user.SshPubKeys", {
	extend: "OMV.workspace.grid.Panel",
	uses: [
		"OMV.data.Store",
		"OMV.data.Model",
		"OMV.data.reader.RpcArray",
		"OMV.module.admin.privilege.user.user.sshpubkeys.PubKey"
	],

	title: _("Public keys"),
	hideEditButton: true,
	hidePagingToolbar: true,
	mode: "local",
	columns: [{
		text: _("Public key"),
		dataIndex: "sshpubkey",
		sortable: false,
		flex: 1,
		renderer: function(value, metaData) {
			metaData.tdCls += " x-monospaced";
			return value.replace(/\n/g, "<br>");
		}
	}],

	initComponent: function() {
		var me = this;
		Ext.apply(me, {
			store: Ext.create("OMV.data.Store", {
				autoLoad: false,
				model: OMV.data.Model.createImplicit({
					idProperty: "sshpubkey",
					fields: [
						{ name: "sshpubkey", type: "string", mapping: 0 }
					]
				}),
				proxy: {
					type: "memory",
					reader: "rpcarray"
				},
				data: []
			})
		});
		me.callParent(arguments);
	},

	onAddButton: function() {
		var me = this;
		Ext.create("OMV.module.admin.privilege.user.user.sshpubkeys.PubKey", {
			title: _("Add public key"),
			listeners: {
				scope: me,
				submit: function(c, value) {
					value = Ext.String.rtrim(value, " \n");
					me.store.addRawData([ value ]);
				}
			}
		}).show();
	},

	setValues: function(values) {
		var me = this;
		me.store.loadRawData(values.sshpubkeys);
		return values.sshpubkeys;
	},

	getValues: function() {
		var me = this;
		var sshpubkeys = [];
		me.store.each(function(record) {
			Ext.Array.push(sshpubkeys, record.get("sshpubkey"));
		});
		return {
			sshpubkeys: sshpubkeys
		};
	}
});

/**
 * @class OMV.module.admin.privilege.user.User
 * @derived OMV.workspace.window.Tab
 */
Ext.define("OMV.module.admin.privilege.user.User", {
	extend: "OMV.workspace.window.Tab",
	uses: [
		"OMV.module.admin.privilege.user.user.General",
		"OMV.module.admin.privilege.user.user.Groups",
		"OMV.module.admin.privilege.user.user.SshPubKeys"
	],

	rpcService: "UserMgmt",
	rpcSetMethod: "setUser",

	width: 420,
	height: 300,

	getTabItems: function() {
		var me = this;
		var displayMode = Ext.isDefined(me.rpcGetMethod) ? "edit" : "add";
		return [
			Ext.create("OMV.module.admin.privilege.user.user.General", {
				displayMode: displayMode
			}),
			Ext.create("OMV.module.admin.privilege.user.user.Groups"),
			Ext.create("OMV.module.admin.privilege.user.user.SshPubKeys")
		];
	}
});

/**
 * @class OMV.module.admin.privilege.user.Import
 * @derived OMV.workspace.window.TextArea
 */
Ext.define("OMV.module.admin.privilege.user.Import", {
	extend: "OMV.workspace.window.TextArea",

	title: _("Import users"),
	width: 580,
	height: 350,

	rpcService: "UserMgmt",
	rpcSetMethod: "importUsers",
	rpcSetPollStatus: true,
	autoLoadData: false,
	submitMsg: _("Importing users ..."),
	hideOkButton: false,
	okButtonText: _("Import"),
	readOnly: false,

	initComponent: function() {
		var me = this;
		me.callParent(arguments);
		// Add the tip toolbar at the bottom of the window.
		me.addDocked({
			xtype: "tiptoolbar",
			dock: "bottom",
			ui: "footer",
			text: _("Each line represents one user. Note, the password must be entered in plain text.")
		});
	},

	getTextAreaConfig: function() {
		return {
			allowBlank: false,
			value: "# <name>;<uid>;<comment>;<email>;<password>;<group,group,...>;<disallowusermod>"
		};
	},

	getValues: function() {
		var me = this;
		var values = me.callParent(arguments);
		return {
			csv: values
		};
	},

	setValues: function(values) {
		var me = this;
		return me.setValues(values.cvs);
	}
});

/**
 * @class OMV.module.admin.privilege.user.SharedFolderPrivileges
 * @derived OMV.workspace.window.Grid
 * Display all shared folder privileges from the given user.
 */
Ext.define("OMV.module.admin.privilege.user.SharedFolderPrivileges", {
	extend: "OMV.workspace.window.Grid",
	requires: [
		"OMV.grid.PrivilegesByRole"
	],

	rpcService: "ShareMgmt",
	rpcSetMethod: "setPrivilegesByRole",

	title: _("Shared folder privileges"),
	width: 500,
	height: 300,
	hideResetButton: true,
	gridClassName: "OMV.grid.PrivilegesByRole",

	/**
	 * The class constructor.
	 * @fn constructor
	 * @param roleName The name of the user. Required.
	 */

	initComponent: function() {
		var me = this;
		me.callParent(arguments);
		// Add the tip toolbar at the bottom of the window.
		me.addDocked({
			xtype: "tiptoolbar",
			dock: "bottom",
			ui: "footer",
			text: _("These settings are used by the services to configure the user access rights. Please note that these settings have no effect on file system permissions.")
		});
	},

	getGridConfig: function() {
		var me = this;
		return {
			border: false,
			stateful: true,
			stateId: "41e79486-1192-11e4-baab-0002b3a176b4",
			roleType: "user",
			roleName: me.roleName
		};
	},

	getRpcSetParams: function() {
		var me = this;
		var privileges = [];
		var items = me.getValues();
		Ext.Array.each(items, function(item) {
			// Set default values.
			var privilege = {
				uuid: item.uuid,
				perms: -1
			};
			if ((true === item.deny) || (true === item.readonly) ||
			  (true === item.writeable)) {
				privilege.perms = 0; // No access
				if (true === item.readonly)
					privilege.perms = 5;
				else if (true === item.writeable)
					privilege.perms = 7;
			}
			Ext.Array.push(privileges, privilege);
		});
		return {
			role: "user",
			name: me.roleName,
			privileges: privileges
		};
	}
});

/**
 * @class OMV.module.admin.privilege.user.Users
 * @derived OMV.workspace.grid.Panel
 */
Ext.define("OMV.module.admin.privilege.user.Users", {
	extend: "OMV.workspace.grid.Panel",
	requires: [
		"OMV.Rpc",
		"OMV.data.Store",
		"OMV.data.Model",
		"OMV.data.proxy.Rpc",
		"OMV.util.Format"
	],
	uses: [
		"OMV.module.admin.privilege.user.User",
		"OMV.module.admin.privilege.user.Import",
		"OMV.module.admin.privilege.user.SharedFolderPrivileges"
	],

	hidePagingToolbar: false,
	stateful: true,
	stateId: "98d6fe31-8e12-407b-82f2-7e0acf4006c1",
	columns: [{
		text: _("Name"),
		sortable: true,
		dataIndex: "name",
		stateId: "name"
	},{
		text: _("Email"),
		sortable: true,
		dataIndex: "email",
		stateId: "email"
	},{
		text: _("Comment"),
		sortable: true,
		dataIndex: "comment",
		stateId: "comment"
	},{
		text: _("Groups"),
		dataIndex: "groups",
		stateId: "groups",
		renderer: function(value) {
			if(Ext.isArray(value))
				value = value.join(", ");
			return OMV.util.Format.whitespace(value);
		}
	}],

	initComponent: function() {
		var me = this;
		Ext.apply(me, {
			store: Ext.create("OMV.data.Store", {
				autoLoad: true,
				model: OMV.data.Model.createImplicit({
					idProperty: "name",
					fields: [
						{ name: "name", type: "string" },
						{ name: "email", type: "string" },
						{ name: "groups", type: "object" },
						{ name: "comment", type: "string" },
						{ name: "system", type: "boolean" },
						{ name: "_used", type: "boolean" }
					]
				}),
				proxy: {
					type: "rpc",
					rpcData: {
						service: "UserMgmt",
						method: "getUserList"
					}
				},
				remoteSort: true,
				sorters: [{
					direction: "ASC",
					property: "name"
				}]
			})
		});
		me.callParent(arguments);
	},

	getTopToolbarItems: function() {
		var me = this;
		var items = me.callParent(arguments);
		// Replace the default 'Add' button.
		Ext.Array.erase(items, 0, 1);
		Ext.Array.insert(items, 0, [{
			id: me.getId() + "-add",
			xtype: "splitbutton",
			text: _("Add"),
			icon: "images/add.png",
			iconCls: Ext.baseCSSPrefix + "btn-icon-16x16",
			handler: function() {
				this.showMenu();
			},
			menu: Ext.create("Ext.menu.Menu", {
				items: [
					{ text: _("Add"), value: "add" },
					{ text: _("Import"), value: "import" }
				],
				listeners: {
					scope: me,
					click: function(menu, item, e, eOpts) {
						this.onAddButton(item.value);
					}
				}
			})
		}]);
		// Add the 'Privileges' button.
		Ext.Array.insert(items, 2, [{
			id: me.getId() + "-privileges",
			xtype: "button",
			text: _("Privileges"),
			icon: "images/share.png",
			iconCls: Ext.baseCSSPrefix + "btn-icon-16x16",
			handler: me.onPrivilegesButton,
			scope: me,
			disabled: true,
			selectionConfig: {
				minSelections: 1,
				maxSelections: 1
			}
		}]);
		return items;
	},

	onAddButton: function(action) {
		var me = this;
		switch(action) {
		case "add":
			Ext.create("OMV.module.admin.privilege.user.User", {
				title: _("Add user"),
				listeners: {
					scope: me,
					submit: function() {
						this.doReload();
					}
				}
			}).show();
			break;
		case "import":
			Ext.create("OMV.module.admin.privilege.user.Import", {
				type: "user",
				listeners: {
					scope: me,
					finish: function() {
						this.doReload();
					}
				}
			}).show();
			break;
		}
	},

	onEditButton: function() {
		var me = this;
		var record = me.getSelected();
		Ext.create("OMV.module.admin.privilege.user.User", {
			title: _("Edit user"),
			rpcGetMethod: "getUser",
			rpcGetParams: {
				name: record.get("name")
			},
			listeners: {
				scope: me,
				submit: function() {
					this.doReload();
				}
			}
		}).show();
	},

	onPrivilegesButton: function() {
		var me = this;
		var record = me.getSelected();
		Ext.create("OMV.module.admin.privilege.user.SharedFolderPrivileges", {
			roleName: record.get("name")
		}).show();
	},

	doDeletion: function(record) {
		var me = this;
		OMV.Rpc.request({
			scope: me,
			callback: me.onDeletion,
			rpcData: {
				service: "UserMgmt",
				method: "deleteUser",
				params: {
					name: record.get("name")
				}
			}
		});
	}
});

OMV.WorkspaceManager.registerNode({
	id: "user",
	path: "/privilege",
	text: _("User"),
	icon16: "images/user.png",
	iconSvg: "images/user.svg",
	position: 10
});

OMV.WorkspaceManager.registerPanel({
	id: "users",
	path: "/privilege/user",
	text: _("Users"),
	position: 10,
	className: "OMV.module.admin.privilege.user.Users"
});
