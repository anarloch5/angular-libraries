import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'ngx-tilt-card',
  templateUrl: './ngx-tilt-card.component.html',
  styleUrls: ['./ngx-tilt-card.component.css']
})
export class NgxTiltCardComponent implements OnInit {

  @HostListener('mouseout') onMouseOut() {
    this.xRot = 0;
    this.yRot = 0;
  }

  @HostListener('mousemove', ['$event']) onMouseMove(event: MouseEvent) {
    let index = event.offsetY / this.tiltContentRef.nativeElement.offsetHeight;
    index = Math.floor(index * 5);
    index = index > this.xRotationMatrix.length -1 ? this.xRotationMatrix.length - 1 : index;
    if(index < this.xRotationMatrix.length && this.xRot !== this.xRotationMatrix[index]){
      this.xRot = this.xRotationMatrix[index];
    } else if(index >= this.xRotationMatrix.length){
      this.xRot = 0;
      this.yRot = 0;
      return;
    }

    index = event.offsetX / this.tiltContentRef.nativeElement.offsetWidth;
    index = Math.floor(index * 5);
    if(index < this.yRotationMatrix.length && this.yRot !== this.yRotationMatrix[index]){
      this.yRot = this.yRotationMatrix[index];
    } else if(index >= this.yRotationMatrix.length){
      this.xRot = 0;
      this.yRot = 0;
    }
  }

  @ViewChild('tilt') tiltContentRef!: ElementRef;

  xRot: number = 0;
  yRot: number = 0;

  @Input() rotationDegreesX: number = 5;
  @Input() rotationDegreesY: number = 5;

  private xRotationMatrix: number[] = [];
  private yRotationMatrix: number[] = [];

  constructor() { }

  ngOnInit(): void {
    this.xRotationMatrix = [
      this.rotationDegreesX,
      this.rotationDegreesX / 2,
      0,
      (this.rotationDegreesX * -1) / 2,
      this.rotationDegreesX * -1
    ];

    this.yRotationMatrix = [
      this.rotationDegreesY * -1,
      (this.rotationDegreesY * -1) / 2,
      0,
      this.rotationDegreesY / 2,
      this.rotationDegreesY
    ];
  }
}
