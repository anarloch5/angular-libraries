import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'ngx-flip-card',
  templateUrl: './ngx-flip-card.component.html',
  styleUrls: ['./ngx-flip-card.component.css']
})
export class NgxFlipCardComponent implements OnInit, AfterViewInit {

  private _isBackSide: boolean = false;
  @Input()
  set isBackSide(value: boolean) {
    if(value === this._isBackSide){
      return;
    }

    this._isBackSide = value;
    this.isBackSideChange.emit(this._isBackSide);
    this.flipInternal();
  }

  get isBackSide(): boolean {
    return this._isBackSide;
  }

  @Output() isBackSideChange = new EventEmitter<boolean>();

  @Input() animate: boolean = true;

  @Input() animationDuration: number = 2500;

  @Output() animationEnd = new EventEmitter<boolean>();

  private canAnimate: boolean = false;

  frontRotation: number = 0;
  backRotation: number = 180;

  private desiredFrontRotation: number = 0;

  frontZindex: number = 1;
  backZindex: number = 0;

  @Input() translationZ: number = 2;
  currentTranslationZ: number = 0;

  @Input() easing: FlipCardEase = 'linear';

  @Input() direction: FlipCardDirection = 'horizontal';

  @Input() flipOnClick: boolean = true;

  private timeLastFrame: number = Date.now();
  private currentAnimationTime: number = 0;
  private animationFrameRef: number | undefined;
  private animating: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.canAnimate = true;
  }

  private flipInternal(){
    this.rotateAction();
  }

  clickHandler() {
    if(this.flipOnClick){
      this.flipCard();
    }
  }

  flipCard() {
    this.isBackSide = !this._isBackSide;
  }

  private rotateAction(){
    if(!this.animate || !this.canAnimate){
      this.rotateFlat();
    } else {
      this.animateRotationStart();
    }
  }

  private rotateFlat(){
    if(this.isBackSide){
      this.frontRotation = 180;
      this.backRotation = 0;
      this.frontZindex = 0;
      this.backZindex = 1;
    } else {
      this.frontRotation = 0;
      this.backRotation = 180;
      this.frontZindex = 1;
      this.backZindex = 0;
    }
  }

  private animateRotationStart(){
    this.desiredFrontRotation = this.isBackSide ? 180 : 0;
    this.timeLastFrame = Date.now();

    if(this.animating){
      this.currentAnimationTime = this.calculateReverseEasing();
    } else {
      this.currentAnimationTime = 0;
    }

    if(this.animationFrameRef){
      cancelAnimationFrame(this.animationFrameRef);
    }
    this.animationFrameRef = requestAnimationFrame(this.animateLoop.bind(this));
    this.animating = true;
    this.currentTranslationZ = this.translationZ;
  }

  private animateLoop(){
    const time = Date.now();
    const deltatime = time - this.timeLastFrame;
    this.timeLastFrame = time;
    this.currentAnimationTime += deltatime;
    const amount = this.currentAnimationTime / this.animationDuration;

    switch(this.easing){
      case 'linear':
        this.frontRotation = this.isBackSide ?
          Math.min(this.lerp(0, this.desiredFrontRotation, amount), this.desiredFrontRotation) :
          Math.max(this.lerp(180, this.desiredFrontRotation, amount), this.desiredFrontRotation);
        break;
      case 'easeIn':
        this.frontRotation = this.isBackSide ?
          Math.min(this.easeIn(0, this.desiredFrontRotation, amount), this.desiredFrontRotation) :
          Math.max(this.easeIn(180, this.desiredFrontRotation, amount), this.desiredFrontRotation);
        break;
      case 'easeOut':
        this.frontRotation = this.isBackSide ?
          Math.min(this.easeOut(0, this.desiredFrontRotation, amount), this.desiredFrontRotation) :
          Math.max(this.easeOut(180, this.desiredFrontRotation, amount), this.desiredFrontRotation);
        break;
      case 'easeInOut':
        this.frontRotation = this.isBackSide ?
          Math.min(this.easeInOut(0, this.desiredFrontRotation, amount), this.desiredFrontRotation) :
          Math.max(this.easeInOut(180, this.desiredFrontRotation, amount), this.desiredFrontRotation);
        break;
    }

    if(this.currentAnimationTime >= this.animationDuration){
      this.frontRotation = this.desiredFrontRotation;
    }

    this.backRotation = this.frontRotation + 180;

    if(this.isBackSide && this.frontRotation >= 90){
      this.frontZindex = 0;
      this.backZindex = 1;
    } else if(!this.isBackSide && this.frontRotation <= 90) {
      this.frontZindex = 1;
      this.backZindex = 0;
    }

    if(this.frontRotation === this.desiredFrontRotation){
      this.animationEnded();
      return;
    }

    this.animationFrameRef = requestAnimationFrame(this.animateLoop.bind(this));
  }

  private lerp(a: number, b: number, n: number) {
    return (1 - n) * a + n * b;
  }

  private easeIn(a: number, b: number, n: number): number {
    return this.lerp(a, b, n * n);
  }

  private easeOut(a: number, b: number, n: number): number {
    return this.lerp(a, b, 1 - (1 - n) * (1 - n));
  }

  private easeInOut(a: number, b: number, n: number): number {
    return this.lerp(a, b, n < 0.5 ? 2 * n * n : 1 - Math.pow(-2 * n + 2, 2) / 2);
  }

  private calculateReverseEasing(): number{
    if(this.easing === 'linear'){
      return this.animationDuration - this.currentAnimationTime;
    }

    const start = this._isBackSide ? 0 : 180;
    const end = this._isBackSide ? 180 : 0;

    // increment 16 milliseconds to simulate animation at 60FPS
    for(let i = 0; i < this.animationDuration; i += 16){
      let inverseValue = 0;
      switch(this.easing){
        case 'easeIn':
          inverseValue = this.easeIn(start, end, i / this.animationDuration);
          break;
        case 'easeOut':
          inverseValue = this.easeOut(start, end, i / this.animationDuration);
          break;
        case 'easeInOut':
          inverseValue = this.easeInOut(start, end, i / this.animationDuration);
          break;
      }

      if((this._isBackSide && inverseValue >= this.frontRotation) ||
            (!this._isBackSide && inverseValue <= this.frontRotation)){
        return i;
      }
    }

    return 0;
  }

  private animationEnded(){
    this.animationEnd.emit(this.isBackSide);
    this.animating = false;
    this.currentTranslationZ = 0;
  }

}

export type FlipCardEase = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut';

export type FlipCardDirection = 'horizontal' | 'vertical';
