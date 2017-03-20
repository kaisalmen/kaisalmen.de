/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

if ( KSX.nav === undefined ) KSX.nav = {};

if ( KSX.nav.help === undefined ) KSX.nav.help;
KSX.nav.help = {
	show: true,
	ownText: false
}
KSX.nav.allowNavMenuToggle = false;
KSX.nav.divNavMenuArea = null;
KSX.nav.divNavMenuButton = null;
KSX.nav.divNavHelpButton = null;
KSX.nav.divNavHelpArea = null;

KSX.nav.toggleNavMenu = function ( menu, help ) {
	if ( menu || help ) KSX.nav.allowNavMenuToggle = true;
	if ( KSX.nav.allowNavMenuToggle ) {

		if ( menu ) {
			KSX.nav.divNavMenuArea.style.display = 'inline';
		} else {
			KSX.nav.divNavMenuArea.style.display = 'none';
		}

		if ( KSX.nav.divNavHelpArea != null ) {
			if ( help ) {
				KSX.nav.divNavHelpArea.style.display = 'inline';
			} else {
				KSX.nav.divNavHelpArea.style.display = 'none';
			}
		}

		if ( menu || help ) {
			KSX.nav.hideNavButtons();
		} else {
			KSX.nav.showNavButtons();
		}
	}

	if ( ! ( menu || help ) && KSX.nav.allowNavMenuToggle ) {
		KSX.nav.allowNavMenuToggle = false;
	}
};

KSX.nav.hideNavButtons = function () {
	KSX.nav.divNavMenuButton.style.display = 'none';
	if ( KSX.nav.divNavHelpButton != null ) KSX.nav.divNavHelpButton.style.display = 'none';
};

KSX.nav.showNavButtons = function () {
	KSX.nav.divNavMenuButton.style.display = 'inline';
	if ( KSX.nav.divNavHelpButton != null ) KSX.nav.divNavHelpButton.style.display = 'inline';
};

KSX.nav.intergrateMenu = function () {
	var menuContent = document.querySelector( 'link[rel="import"]' ).import;
	var parent = document.body;

	// bind variables imported from NavMenu.src
	KSX.nav.divNavMenuArea = document.importNode( menuContent.getElementById( 'navMenuArea' ), true );
	KSX.nav.divNavMenuButton = document.importNode( menuContent.getElementById( 'navMenuButton' ), true );
	if ( KSX.nav.help.show ) {

		KSX.nav.divNavHelpButton = document.importNode( menuContent.getElementById( 'navHelpButton' ), true );
		if ( KSX.nav.help.ownText ) {

			KSX.nav.divNavHelpArea = document.getElementById( 'navHelpArea' );

		} else {

			KSX.nav.divNavHelpArea = document.importNode( menuContent.getElementById( 'navHelpArea' ), true );
			parent.insertBefore( KSX.nav.divNavHelpArea, parent.children[ 1 ] );

		}
		parent.insertBefore( KSX.nav.divNavHelpButton, parent.children[ 1 ] );

	}
	parent.insertBefore( KSX.nav.divNavMenuArea, parent.children[ 1 ] );
	parent.insertBefore( KSX.nav.divNavMenuButton, parent.children[ 1 ] );
};
