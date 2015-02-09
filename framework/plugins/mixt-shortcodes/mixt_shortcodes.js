
// (function() {
	
// 	tinymce.create('tinymce.plugins.mixtSG', {
// 		init : function(ed, url) {
// 			ed.addCommand('mcebutton', function() {
// 				ed.windowManager.open({
// 					file : url + '/form_html.php',
// 					width : 300 + parseInt(ed.getLang('button.delta_width', 0)),
// 					height : 440 + parseInt(ed.getLang('button.delta_height', 0)),
// 					inline : 1
// 				}, {
// 					plugin_url : url
// 				});
// 			});

// 			ed.addButton('mixt_button', {
// 				title : 'Add Shortcode',
// 				cmd : 'mcebutton',
// 				image: url + '/img/icon.png'
// 			});
// 		},
		 
// 		getInfo : function() {
// 			return {
// 				longname : 'MIXT Shortcode Generator',
// 				author : 'Alex Nitu (novalex)',
// 				authorurl : 'http://novalx.com',
// 				infourl : 'http://novalx.com',
// 				version : tinymce.majorVersion + '.' + tinymce.minorVersion
// 			};
// 		}
// 	});

// 	tinymce.PluginManager.add('mixt_button', tinymce.plugins.mixtSG);

// })();

(function() {
	tinymce.PluginManager.add('mixt_shortcodes', function( editor, url ) {
		editor.addButton( 'mixt_sg_button', {
			title: 'Add Shortcode',
			type: 'menubutton',
			image: url + '/img/icon.png',
			menu: [
				{
					text: 'Item 1',
					menu: [
						{
							text: 'Pop-Up',
							onclick: function() {
								editor.windowManager.open( {
									title: 'Insert Random Shortcode',
									body: [
										{
											type: 'textbox',
											name: 'textboxName',
											label: 'Text Box',
											value: '30'
										},
										{
											type: 'textbox',
											name: 'multilineName',
											label: 'Multiline Text Box',
											value: 'You can say a lot of stuff in here',
											multiline: true,
											minWidth: 300,
											minHeight: 100
										},
										{
											type: 'listbox',
											name: 'listboxName',
											label: 'List Box',
											'values': [
												{text: 'Option 1', value: '1'},
												{text: 'Option 2', value: '2'},
												{text: 'Option 3', value: '3'}
											]
										}
									],
									onsubmit: function( e ) {
										editor.insertContent( '[random_shortcode textbox="' + e.data.textboxName + '" multiline="' + e.data.multilineName + '" listbox="' + e.data.listboxName + '"]');
									}
								});
							}
						}
					]
				}
			]
		});
	});
})();