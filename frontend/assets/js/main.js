(function($) {

    $(function() {

        $('.modal-content').on('click', '[data-action]', function() {
            var self$ = $(this),
                modal$ = self$.parents('.modal-content'),
                data = self$.data('action');

            switch(data) {
                case 'clear':
                    modal$.find('.input').each(function() {
                        $(this).val('');
                    });
                    break;
                default:
                    break;
            }
        });

        $('.form__add-table').on('submit', function(e) {
            e.preventDefault();

            var self$ = $(this),
                modal$ = self$.parents('.modal'),
                rows = self$.find('[data-value=rows]').val() || null,
                fields = self$.find('[data-value=fields]').val() || null,
                meta  = self$.find('[data-value=meta]').val() || null;

            if ( rows == null || fields == null ) return false;

            var tableName = 'table-' + count;

            objTables[tableName] = new Table(tableName, rows, fields, meta);
            objTables[tableName].insertTable($('.section__table'));

            modal$.modal('hide');
            setTimeout(function() {
                modal$.find('.input').each(function() {
                    $(this).val('');
                });
            }, 500);

        });

    });

})(jQuery);
