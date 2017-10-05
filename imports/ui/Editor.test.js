import {Meteor} from 'meteor/meteor';
import React from 'react';
import expect from 'expect';
import {mount} from 'enzyme';

import {Editor} from './Editor';
import {notes} from '../fixtures/fixtures';

if (Meteor.isClient) {

    describe('Editor', function () {

        let browserHistory;
        let call;

        beforeEach(function () {
            call = expect.createSpy();
            browserHistory = {
                push: expect.createSpy()
            };
        });

        it('should render pick note message', function () {

            const wrapper = mount(<Editor browserHistory={browserHistory}
                                          call={call}/>);

            expect(wrapper.find('p').text()).toBe('Pick or create a note to start!');

        });

        it('should render Note not found message', function () {

            const wrapper = mount(<Editor browserHistory={browserHistory}
                                          call={call}
                                          selectedNoteId={notes[0]._id}/>);

            expect(wrapper.find('p').text()).toBe('Note not found');

        });

        it('should remove note', function () {

            const wrapper = mount(<Editor browserHistory={browserHistory}
                                          call={call}
                                          selectedNoteId={notes[0]._id}
                                          note={notes[0]}/>);

            wrapper.find('button').simulate('click');

            expect(call.calls[0].arguments[0]).toBe('notes.remove');
            expect(call.calls[0].arguments[1]).toBe(notes[0]._id);
            expect(browserHistory.push).toHaveBeenCalledWith('/dashboard');
        });

    });
}

