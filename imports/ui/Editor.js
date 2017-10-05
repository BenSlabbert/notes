import React from 'react';
import PropTypes from 'prop-types';
import {createContainer} from 'meteor/react-meteor-data';
import {Session} from 'meteor/session';
import {Meteor} from 'meteor/meteor';
import {browserHistory} from 'react-router';

import {Notes} from '../api/notes';

export class Editor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            title: '',
            body: ''
        };
    }

    handleBodyChange(e) {
        const body = e.target.value;
        this.setState({body});
        this.props.call('notes.update', this.props.note._id, {body});
    }

    handleTitleChange(e) {
        const title = e.target.value;
        this.setState({title});
        this.props.call('notes.update', this.props.note._id, {title});
    }

    // here we can watch for changes to sate
    // and props
    componentDidUpdate(prevProps, prevState) {
        const currentNoteId = this.props.note ? this.props.note._id : undefined;
        const prevNoteId = prevProps.note ? prevProps.note._id : undefined;

        if (currentNoteId && currentNoteId != prevNoteId) {
            this.setState({
                title: this.props.note.title,
                body: this.props.note.body
            });
        }
    }

    render() {

        if (this.props.note) { // we have a note
            return (
                <p>
                    <input value={this.state.title}
                           placeholder="Untitled"
                           onChange={this.handleTitleChange.bind(this)}/>
                    <textarea value={this.state.body}
                              placeholder="Note here ..."
                              onChange={this.handleBodyChange.bind(this)}>
                    </textarea>
                    <button onClick={() => {
                        this.props.call('notes.remove', this.props.note._id);
                        this.props.browserHistory.push('/dashboard');
                    }}>Delete Note
                    </button>
                </p>
            );
        } else { // nothing selected
            return (
                <p>
                    {this.props.selectedNoteId ? 'Note not found' : 'Pick or create a note to start!'}
                </p>
            );
        }
    }
}

Editor.propTypes = {
    selectedNoteId: PropTypes.string,
    note: PropTypes.object,
    call: PropTypes.func.isRequired,
    browserHistory: PropTypes.object.isRequired
};

export default createContainer(() => {

    const selectedNoteId = Session.get('selectedNoteId');

    return {
        selectedNoteId,
        note: Notes.findOne(selectedNoteId),
        call: Meteor.call,
        browserHistory
    };
}, Editor);
