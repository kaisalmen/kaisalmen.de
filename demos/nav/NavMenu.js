/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

var allowNavMenuToggle = false;
var divNavMenuArea = null;
var divNavMenuButton = null;
var divNavHelpButton = null;
var divNavHelpArea = null;

var toggleNavMenu = function ( menu, help ) {
	if ( menu || help ) allowNavMenuToggle = true;
	if ( allowNavMenuToggle ) {

		if ( menu ) {
			divNavMenuArea.style.display = 'inline';
		} else {
			divNavMenuArea.style.display = 'none';
		}

		if ( divNavHelpArea != null ) {
			if ( help ) {
				divNavHelpArea.style.display = 'inline';
			} else {
				divNavHelpArea.style.display = 'none';
			}
		}

		if ( menu || help ) {
			hideNavButtons();
		} else {
			showNavButtons();
		}
	}

	if ( ! ( menu || help ) && allowNavMenuToggle ) {
		allowNavMenuToggle = false;
	}
};

var hideNavButtons = function () {
	divNavMenuButton.style.display = 'none';
	if ( divNavHelpButton != null ) divNavHelpButton.style.display = 'none';
};

var showNavButtons = function () {
	divNavMenuButton.style.display = 'inline';
	if ( divNavHelpButton != null ) divNavHelpButton.style.display = 'inline';
};
