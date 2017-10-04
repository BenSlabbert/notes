import React from 'react';
import PropTypes from 'prop-types';
import {createContainer} from 'meteor/react-meteor-data';
import {Session} from 'meteor/session';
import {Meteor} from 'meteor/meteor';

import {Notes} from '../api/notes';

export class Editor extends React.Component {

    handleBodyChange(e) {

        this.props.call('notes.update', this.props.note._id, {
            body: e.target.value
        });
    }

    handleTitleChange(e) {

        this.props.call('notes.update', this.props.note._id, {
            title: e.target.value
        });
    }

    render() {

        if (this.props.note) { // we have a note
            return (
                <p>
                    <input value={this.props.note.title}
                           placeholder="Untitled"
                           onChange={this.handleTitleChange.bind(this)}/>
                    <textarea value={this.props.note.body}
                              placeholder="Note here ..."
                              onChange={this.handleBodyChange.bind(this)}>
                    </textarea>
                    <button>Delete Note</button>
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
    note: PropTypes.object,
    selectedNoteId: PropTypes.string
};

export default createContainer(() => {

    const selectedNoteId = Session.get('selectedNoteId');

    return {
        selectedNoteId,
        note: Notes.findOne(selectedNoteId),
        call: Meteor.call
    };
}, Editor);
