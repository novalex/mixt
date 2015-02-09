<?php

[
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

