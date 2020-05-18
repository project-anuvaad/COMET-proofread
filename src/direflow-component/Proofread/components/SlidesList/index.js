import React from 'react';
import PropTypes from 'prop-types'
import classnames from 'classnames';
import { Grid, Icon, Button, Card, Input, Modal } from 'semantic-ui-react';
import { Styled } from 'direflow-component'
import './style.scss';
import styles from './style.scss';
import Slide from './Slide';

class SlidesList extends React.Component {
  state = {
    isDeleteModalVisible: false,
    selectedSlide: null,
    selectedSlideIndex: null,
  }
  getsubSlideBorderColor(slide) {
    if (slide.text && slide.audio) {
      return 'green';
    } else {
      return 'gray';
    }
  }


  renderSlide(slide, index) {
    const { editable, currentSlideIndex, } = this.props;
    return (
      <Grid.Row
        key={`slide-list-${index}`}
        onClick={(e) => {
          this.props.onSlideClick(slide, index)
        }}
      >
        <Grid.Column width={16}>
          <Slide
            slide={slide}
            index={index}
            editable={editable && currentSlideIndex === index}
            speakers={this.props.speakers}
            currentSlideIndex={currentSlideIndex}
            active={currentSlideIndex === index}
            onChange={changes => this.props.onChange({ slide, index, changes })}
            onDelete={() => this.setState({ selectedSlide: slide, selectedSlideIndex: index, isDeleteModalVisible: true })}
          />
        </Grid.Column>
      </Grid.Row>
    )
  }

  render() {
    return (
      <Styled styles={styles}>
        <div>
          <Grid className="slides-container">
            {this.props.slides.map((slide, index) => this.renderSlide(slide, index))}
            <Modal open={this.state.isDeleteModalVisible} size="tiny" onClose={() => this.setState({ isDeleteModalVisible: false })}>
              <Modal.Header>Delete Subtitle</Modal.Header>
              <Modal.Content>
                Are you sure you want to delete this item?
              </Modal.Content>
              <Modal.Actions>
                <Button onClick={() => this.setState({ isDeleteModalVisible: false })}>Cancel</Button>
                <Button color="red" onClick={() => { this.setState({ isDeleteModalVisible: false }); this.props.onDeleteSlide({ slide: this.state.selectedSlide, index: this.state.selectedSlideIndex }) }}>Yes</Button>
              </Modal.Actions>
            </Modal>
          </Grid>
          <div className="note">
            <small >Note: Timing is in <strong>MM:SS</strong> format</small>
          </div>
        </div>
      </Styled>
    )
  }

}

SlidesList.propTypes = {
  slides: PropTypes.array,
  currentSlideIndex: PropTypes.number,
  translateable: PropTypes.bool,
  onSubslideClick: PropTypes.func,
}

SlidesList.defaultProps = {
  slides: [],
  currentSlideIndex: 0,
  translateable: false,
  onSubslideClick: () => { },
}

export default SlidesList;
