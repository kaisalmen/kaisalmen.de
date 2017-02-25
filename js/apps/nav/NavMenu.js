/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

var allowNavMenuToggle = false;
var divNavMenu = null;
var divNavMenuButton = null;
var divNavContact = null;
var divNavContactArea = null;

var toggleNavMenu = function ( menu, contact ) {
	if ( menu ||contact ) allowNavMenuToggle = true;
	if ( allowNavMenuToggle ) {

		if ( menu ) {
			divNavMenu.style.display = 'inline';
		} else {
			divNavMenu.style.display = 'none';
		}

		if ( divNavContactArea != null ) {
			if ( contact ) {
				divNavContactArea.style.display = 'inline';
			} else {
				divNavContactArea.style.display = 'none';
			}
		}

		if ( menu || contact ) {
			hideNavButtons();
		} else {
			showNavButtons();
		}
	}

	if ( ! ( menu || contact ) && allowNavMenuToggle ) {
		allowNavMenuToggle = false;
	}
};

var hideNavButtons = function () {
	divNavMenuButton.style.display = 'none';
	if ( divNavContact != null ) divNavContact.style.display = 'none';
};

var showNavButtons = function () {
	divNavMenuButton.style.display = 'inline';
	if ( divNavContact != null ) divNavContact.style.display = 'inline';
};
