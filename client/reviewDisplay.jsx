import React from 'react';
import moment from 'moment';
import Stars from './Stars.jsx';


class Review extends React.Component {
  constructor(props) {
    super(props);
    this.long = undefined;
    this.state = {
      expanded: false,
      long: true
    };
    this.review = React.createRef();
    this.text = React.createRef();
  }

  readMoreHandler() {
    this.setState({expanded: !this.state.expanded});
  }

  componentDidMount() {
    this.checkReviewLength();
    window.addEventListener('resize', () => this.checkReviewLength());    
  }

  checkReviewLength() {
    const long = this.review.current.clientHeight < this.text.current.clientHeight;
    this.setState({long});
  }

  render() {
    return (
      <div>
        <div>{this.props.data.name}</div>
        <div><Stars num={this.props.data.overall} /></div>
        <div>Dined on {moment(this.props.data.date).format('MMMM Do YYYY')}</div>
        <div>Overall {this.props.data.overall} &middot; Food {this.props.data.food} &middot; Service {this.props.data.service} &middot; Ambience {this.props.data.ambience}</div>
        <div ref={this.review} className={this.state.expanded ? 'review' : 'truncated review'}>
          <div ref={this.text}>
            {this.props.data.text.split('\n\n').map((paragraph, idx) => {
              return (<p key={idx}>{paragraph}</p>);
            })}
          </div>
        </div>
        {this.state.long ? <button onClick={() => this.readMoreHandler()}>{this.state.expanded ? 'Read less' : 'Read more'}</button> : null}
        <button>report</button><button>helpful</button>
      </div>
    );
  }

}

export default Review;

