// Call the dataTables jQuery plugin

$(document).ready(function() {
  console.log(1)
  var listCustomersDataTable = $('#listCustomersDataTable').DataTable( {
    "order": [[ 2, "asc" ]]
  });
  console.log(2)


  $('#listCustomersDataTable tbody').on( 'mouseenter', 'td', function () {
      var colIdx = listCustomersDataTable.cell(this).index().column;
      var rowIdx = listCustomersDataTable.cell(this).index().row;

      $( listCustomersDataTable.cells().nodes() ).removeClass( 'highlight' );
      $( listCustomersDataTable.rows().nodes() ).removeClass( 'highlight' );
      $( listCustomersDataTable.column( colIdx ).nodes() ).addClass( 'highlight' );
      $( listCustomersDataTable.row( rowIdx ).nodes() ).addClass( 'highlight' );
  } );
  console.log(3)
});
