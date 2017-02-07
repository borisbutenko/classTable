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

var objTables = {},
    count     = 1;

var Table = function(name, rows, fields, meta) {
    this.name         = name;
    this.rows         = parseInt(rows);
    this.fields       = fields.split(', ');
    this.meta         = (meta != null) ? meta.split(', ') : meta;

    this.controlPanel =
        $('<div class="btn-toolbar" role="toolbar" aria-label="table-control">' +
            '<div class="btn-group btn-group-lg mr-2" role="group" aria-label="first-group">' +
                '<button type="button" class="button btn btn-secondary" data-action="save-table">Save</button>' +
                '<button type="button" class="button btn btn-secondary" data-action="get-data">JSON</button>' +
                '<button type="button" class="button btn btn-secondary" data-action="clean-table">Clean</button>' +
            '</div>' +
            '<div class="btn-group btn-group-lg" role="group" aria-label="second-group">' +
                '<button type="button" class="button btn btn-secondary" data-action="add-row">Add row</button>' +
                '<button type="button" class="button btn btn-secondary" data-action="add-row-pos">Add row at:</button>' +
                '<input class="input input-pos" type="text" placeholder="Position" value="0">' +
            '</div>' +
            '<div class="btn-group btn-group-lg" role="group" aria-label="third-group">' +
                '<button type="button" class="button btn btn-secondary" data-action="del-table">Delete</button>' +
            '</div>' +
        '</div>');

    this.table = this.create();
    this.json = {};

    count++;
};

Table.prototype.create = function() {
    var table$   = $('<table class="table table-bordered class-table" data-table='+ this.name +'>'),
        caption$ = $('<caption class="caption">').text(this.name),
        thead$   = $('<thead>'),
        tbody$   = $('<tbody>'),
        theadTr$ = $('<tr>'),
        tbodyTr$ = $('<tr>');

    for (var i = 0; i < this.fields.length; i++) {
        theadTr$.append('<th>' + this.fields[i] + '</th>');
        tbodyTr$.append('<td>');
    }

    if ( this.meta && this.meta[0] ) theadTr$.addClass(this.meta[0]);

    thead$.append(theadTr$);

    for (i = 0; i < this.rows; i++) {
        var nextTr$ = tbodyTr$.clone();
        if ( this.meta && this.meta[1] && i % 2 != 0 ) nextTr$.addClass(this.meta[1]);
        if ( this.meta && this.meta[2] && i % 2 == 0 ) nextTr$.addClass(this.meta[2]);
        tbody$.append(nextTr$);
    }

    table$.append(
        caption$,
        thead$,
        tbody$
    ).find('td')
    .css({
        width : 100 / this.fields.length + '%'
    });

    return table$;
};

Table.prototype.insertTable = function(target$) {
    target$.append(
        $('<div class="layout">').append($(this.table), $(this.controlPanel))
    );

    this.addEvents();
    this.update($(this.table));
};

Table.prototype.get_data = function(table$) {
    if ( !arguments.length ) {
        console.log(this.json);
        alert(this.json);
        return this.json;
    }

    var arr = [],
        th$ = table$.find('thead th'),
        body$ = table$.find('tbody tr');

    body$.each(function(i) {
        arr[i] = {};

        $(this).find('td').each(function(cellIndex) {
            arr[i][$(th$[cellIndex]).text()] = $(this).text();
        });
    });

    this.json = JSON.stringify(arr, '', 4);
};

Table.prototype.save = function(table$) {
    table$.find('td > input').each(function() {
        var self$ = $(this),
            value = self$.val();

        self$.parent().text(value).end().remove();
    });

    this.update(table$);
};

Table.prototype.clean = function(table$)  {
    this.table.find('td').text('');
    this.update(table$);
};

Table.prototype.addRow = function(table$) {
    var tr$ = $('<tr>');

    for (var i = 0; i < this.fields.length; i++) {
        tr$.append('<td>');
    }

    table$.find('tbody').append(tr$);

    this.update(table$);
};

Table.prototype.addRowPos = function(table$, pos) {
    var tr$ = $('<tr>'),
        trs$ = table$.find('tbody tr');

    for (var i = 0; i < this.fields.length; i++) {
        tr$.append('<td>');
    }

    if ( pos == this.rows ) table$.find('tbody').append(tr$);
    else if ( pos <= this.rows && pos >= 0 ) $(trs$[pos]).before(tr$);

    this.update(table$);
};

Table.prototype.delTable = function(table$) {
    table$.parents('.layout').remove();
    // delete objTables[this.name];
};

Table.prototype.update = function(table$) {
    this.table = table$;
    this.rows = table$.find('tbody')[0].rows.length;
    this.get_data(table$, true);
};

Table.prototype.addEvents = function() {
    var T = this;

    T.table
        .on('dblclick', 'td', function() {
            var self$ = $(this),
                input$ = $('<input class="input input-td" type="text">');

            if ( self$.find('input').length ) return false;

            if ( !self$.find('input').length ) {
                input$.val(self$.text());
                self$.text('');
            }

            self$.append(input$);

            return false;
        })
        .next().on('click', '[data-action]', function() {
            var self$ = $(this),
                table$ = self$.parents('[aria-label=table-control]').prev(),
                data = self$.data('action');

            switch(data) {
                case 'save-table':
                    T.save(table$);
                    break;
                case 'get-data':
                    T.get_data();
                    break;
                case 'clean-table':
                    T.clean(table$);
                    break;
                case 'add-row':
                    T.addRow(table$);
                    break;
                case 'add-row-pos':
                    var pos = parseInt(self$.next().val());
                    T.addRowPos(table$, pos);
                    break;
                case 'del-table':
                    T.delTable(table$);
                    break;
                default:
                    break;
            }

            return false;
        });
};
