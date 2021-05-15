
$(document).ready(function() {
  console.log(1)
  var listStockItemsDataTable = $('#listStockItemsDataTable').DataTable( {
    "order": [[ 2, "asc" ]]
  });

  console.log(2)
  $('#listStockItemsDataTable tbody').on( 'mouseenter', 'td', function () {
      var colIdx = listStockItemsDataTable.cell(this).index().column;
      var rowIdx = listStockItemsDataTable.cell(this).index().row;

      $( listStockItemsDataTable.cells().nodes() ).removeClass( 'highlight' );
      $( listStockItemsDataTable.rows().nodes() ).removeClass( 'highlight' );
      $( listStockItemsDataTable.column( colIdx ).nodes() ).addClass( 'highlight' );
      $( listStockItemsDataTable.row( rowIdx ).nodes() ).addClass( 'highlight' );
  } );
  console.log(3)
});