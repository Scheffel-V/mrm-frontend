import { coerceNumberProperty } from '@angular/cdk/coercion';
import { AfterViewInit, Component, ElementRef, Input, SimpleChanges } from '@angular/core';
import { CanColor, mixinColor, ThemePalette } from '@angular/material/core';

const BASE_SIZE = 100;
const BASE_STROKE_WIDTH = 10;
export class SpinnerContainerBase {
  constructor(public _elementRef: ElementRef) { }
}
export const _SpinnerContainerMixinBase = mixinColor(SpinnerContainerBase, 'primary');

/**
 * @title Progress spinner container for spinner circle background and value display
 */
@Component({
  selector: 'spinner-container',
  templateUrl: 'spinner-container.html',
  styleUrls: ['spinner-container.scss'],
  host: {
    'class': 'spinner-container',
    '[style.width.px]': 'diameter',
    '[style.height.px]': 'diameter',
    '[style.line-height.px]': 'diameter'
  }
})
export class SpinnerContainer extends _SpinnerContainerMixinBase implements AfterViewInit, CanColor {

  constructor(public _elementRef: ElementRef) {
    super(_elementRef);
  }

  @Input() color: ThemePalette = 'primary';

	@Input()
	get diameter(): number { return this._diameter; }
	set diameter(size: number) {
		this._diameter = coerceNumberProperty(size);
	}
	private _diameter: number = BASE_SIZE;

  @Input() displayWith: (number) => string | number;

  @Input()
  get strokeWidth() { return this._strokeWidth; }
  set strokeWidth(newValue: number) {
    if (newValue) {
      this._strokeWidth = Math.min(this.diameter / 2, coerceNumberProperty(newValue));
      if (this._spinnerBackgroundElement) {
        this._spinnerBackgroundElement.style.borderWidth = this.strokeWidth + 'px';
      }
    }
  }
  private _strokeWidth: number = BASE_STROKE_WIDTH;
  
  @Input()
	get value(): number { return this._value; }
	set value(newValue: number) {
		this._value = Math.max(0, Math.min(100, coerceNumberProperty(newValue)));
	}
	private _value: number = 0;

  private _spinnerBackgroundElement: HTMLElement;

  ngAfterViewInit() {
    this._spinnerBackgroundElement = this._elementRef.nativeElement.querySelector('.spinner-background');
    this._spinnerBackgroundElement.style.borderWidth = this.strokeWidth + 'px';
  }
}
