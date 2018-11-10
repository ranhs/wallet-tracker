import { Component, OnInit } from '@angular/core';
import { $ } from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'app';
  public valueChange : number = 12.3;

  constructor(){}
  
  ngOnInit(){
    //document ready function
    // $(function(){
    //   AppComponent.scrollContentToBottom(); //initialize the scrolling to bottom
    // });
  }

  //this function needs to be called whenever we add an item to the list
  static scrollContentToBottom(){
    let $content = $("#content");
    $content.scrollTop($content.height());
    console.log($content.scrollTop());
    
  }



}
