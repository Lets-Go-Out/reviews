import React from 'react';

const Stars = (props) => (<div></div>);

const Review = (props) => (
  <div>
    <div>props.name</div>
    <Stars num={props.overall} />
    <div>Dined on {props.date}</div>
    <div>Overall {props.overall} &middot; Food {props.food} &middot; Service {props.service} &middot; Ambience {props.ambience}</div>
    <div>{props.text.split('\n\n').map(paragraph => {
      return `<p>${paragraph}</p>`;
    }).join('')}</div>
  </div>
);