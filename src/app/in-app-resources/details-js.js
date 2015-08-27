$(function() {
	$('table').stacktable({minColCount:2}); // Make responsive tables
});

/* ************************************************************************* *\
 *
 * SEARCH
 * THIS IS A MODIFIER VERSION OF STACKTABLE.JS
 *
 * - Only prints content if there's an actual content, else print a divider
 * - added setting 'minColCount', for setting when responsive table should kick in.
 * - adding class 'stacktable-original' to the original table.
 *
 *
 * stacktable.js
 * Author & copyright (c) 2012: John Polacek
 * Dual MIT & GPL license
 *
 * Page: http://johnpolacek.github.com/stacktable.js
 * Repo: https://github.com/johnpolacek/stacktable.js/
 *
 * jQuery plugin for stacking tables on small screens
 *
 \* ************************************************************************* */
(function($) {

	$.fn.stacktable = function(options) {
		var $tables = this,
			defaults = {
				id:'stacktable',
				hideOriginal:false,
				minColCount: 0
			},
			settings = $.extend({}, defaults, options),
			stacktable;

		return $tables.each(function() {

			var $table = $(this);
			var $topRow = $table.find('tr').first();
			var columnCount = $topRow.find('td, th').length;

			if (columnCount > settings.minColCount && $table.hasClass('no-responsive') === false) {

				$table.addClass('stacktable-original');

				var $stacktable = $('<table class="'+settings.id+'"><tbody></tbody></table>');
				if (typeof settings.myClass !== undefined) $stacktable.addClass(settings.myClass);
				var markup = '';

				$table.find('tr').each(function(index) {
					markup += '<tr>';
					// for the first row, top left table cell is the head of the table
					if (index===0) {
						markup += '<tr><th class="st-head-row st-head-row-main" colspan="2">'+$(this).find('th,td').first().html()+'</th></tr>';
					}
					// for the other rows, put the left table cell as the head for that row
					// then iterate through the key/values
					else {
						$(this).find('td').each(function(index) {
							if (index===0) {

								if ($(this).html().replace('&nbsp;', '').trim().length > 0) {
									markup += '<tr><th class="st-head-row" colspan="2">'+ $(this).html() +'</th></tr>';
								} else {
									markup += '<tr><td class="st-divider" colspan="2"></td></tr>';
								}

							} else {
								if ($(this).html() !== ''){
									markup += '<tr>';
									if ($topRow.find('td,th').eq(index).html()){
										markup += '<td class="st-key">'+$topRow.find('td,th').eq(index).html()+'</td>';
									} else {
										markup += '<td class="st-key"></td>';
									}
									markup += '<td class="st-val">'+$(this).html()+'</td>';
									markup += '</tr>';
								}
							}
						});
					}
				});
				$stacktable.append($(markup));
				$table.before($stacktable);
				if (settings.hideOriginal) $table.hide();

			}

		});
	};

}(jQuery));
