/* eslint-env browser */

import React from 'react';
import moment from 'moment';
import Stars from './Stars.jsx';
import PropTypes from 'prop-types';
import API from './APICalls.js'


class Review extends React.Component {
  constructor(props) {
    super(props);
    this.long = undefined;
    this.state = {
      expanded: false,
      long: true,
    };
    this.review = React.createRef();
    this.text = React.createRef();
  }


  componentDidMount() {
    this.checkReviewLength();
    window.addEventListener('resize', () => this.checkReviewLength());
  }

  readMoreHandler() {
    const { expanded } = this.state;
    this.setState({ expanded: !expanded });
  }

  checkReviewLength() {
    const long = this.review.current.clientHeight < this.text.current.clientHeight;
    this.setState({ long });
  }

  markHelpful() {
    const { data } = this.props;
    API.markHelpful(data.id, () => console.log('this review marked helpful'));
  }

  report() {
    const { data } = this.props;
    API.report(data.id, () => console.log('this review reported'));
  }



  render() {
    const { data } = this.props;
    const { expanded, long } = this.state;
    return (
      <div>
        <div>
          {data.name}
        </div>
        <div>
          <Stars num={data.overall} />
        </div>
        <div>
          {`Dined on ${moment(data.date).format('MMMM Do YYYY')}`}
        </div>
        <div>
          {`Overall ${data.overall} \u00B7 Food ${data.food} \u00B7 Service ${data.service} \u00B7 Ambience ${data.ambience}`}
        </div>
        <div ref={this.review} className={expanded ? 'review' : 'truncated review'}>
          <div ref={this.text}>
            {data.text.split('\n\n').map(paragraph => (
              <p>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
        {long
          ? (
            <button type="button" className="readMore" onClick={() => this.readMoreHandler()}>
              {expanded ? 'Read less' : 'Read more'}
            </button>
          )
          : null}
        <button type="button" onClick={() => this.report()}>
          report
        </button>
        <button type="button" onClick={() => this.markHelpful()}>
          helpful
        </button>
      </div>
    );
  }
}

Review.defaultProps = {
  data: {},
};

Review.propTypes = {
  data: PropTypes.object,
};

export default Review;
