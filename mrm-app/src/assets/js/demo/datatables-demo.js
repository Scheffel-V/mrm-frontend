// Call the dataTables jQuery plugin
$(document).ready(function() {
  var table = $('#dataTable').DataTable( {
    "order": [[ 2, "desc" ]]
  });

  $('#dataTable tbody').on( 'mouseenter', 'td', function () {
      var colIdx = table.cell(this).index().column;
      var rowIdx = table.cell(this).index().row;

      $( table.cells().nodes() ).removeClass( 'highlight' );
      $( table.rows().nodes() ).removeClass( 'highlight' );
      $( table.column( colIdx ).nodes() ).addClass( 'highlight' );
      $( table.row( rowIdx ).nodes() ).addClass( 'highlight' );
  } );
});
