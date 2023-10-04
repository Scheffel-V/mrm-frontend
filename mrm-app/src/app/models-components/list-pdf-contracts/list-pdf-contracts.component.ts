import {AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {ContractPDFService} from "../../services/contract-pdf.service";
import {Rental} from "../../models/rental.model";
import {MatTableDataSource} from "@angular/material/table";
import {PdfContract} from "../../models/pdfContract.model";
import {DatePipe} from "@angular/common";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {MatSnackBar, MatSnackBarConfig} from "@angular/material/snack-bar";

@Component({
  selector: 'app-list-pdf-contracts',
  templateUrl: './list-pdf-contracts.component.html',
  styleUrls: ['./list-pdf-contracts.component.scss']
})
export class ListPdfContractsComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() rental!: Rental;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public displayedColumns = ['actions', 'id', 'date'];
  public dataSource = new MatTableDataSource<PdfContract>();

  constructor(
    private contractPDFService: ContractPDFService,
    private datePipe: DatePipe,
    private matSnackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.dataSource.data = this.rental.pdfContracts;
  }

  public ngAfterViewInit(): void {
    this.setPaginator()
    this.setSorter()
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['rental'] && changes['rental']['currentValue']) {
      this.rental = changes['rental']['currentValue'];
      this.dataSource.data = this.rental.pdfContracts;
    }
  }

  private setSorter() {
    this.dataSource.sort = this.sort
    this.dataSource.sortingDataAccessor = (item, property) => {
      return item[property]
    }
  }

  private setPaginator() {
    this.dataSource.paginator = this.paginator
  }

  public async uploadPdfContract(): Promise<void> {
    const builder = await this.contractPDFService.getContractBlob(this.rental.id);
    builder.getBlob((blob) => {
      this.contractPDFService.uploadPdfContract(this.rental.id, blob).subscribe((newPdfContract: PdfContract): void => {
          this.rental.pdfContracts.push(newPdfContract);
          this.dataSource.data = this.rental.pdfContracts;
          this.openSnackBar('Contrato salvo no histórico!')
        },
        error => {
          this.openSnackBar('Falha ao salvar contrato no histórico!');
        }
      );
    });
  }

  public async uploadPdfContractOnSave(rental): Promise<void> {
    const builder = await this.contractPDFService.getContractBlob(rental.id);
    builder.getBlob((blob) => {
      this.contractPDFService.uploadPdfContract(rental.id, blob).subscribe();
    });
  }

  public openPdf(pdfContract: PdfContract): void {
    this.contractPDFService.getPdfContract(pdfContract.id).subscribe(
      file => {
        const fileURL = URL.createObjectURL(file);
        const a = document.createElement("a");
        a.href = fileURL;
        a.target = '_blank';
        a.download = 'Contrato-' + this.rental.id + '-' + this.datePipe.transform(pdfContract.createdAt,'dd-MM-yyyy');
        a.click();
      }
    );
  }

  public openSnackBar(message: string) {
    const config = new MatSnackBarConfig();
    config.panelClass = 'center';
    config.duration = 2000
    this.matSnackBar.open(message, null, config);
  }
}
