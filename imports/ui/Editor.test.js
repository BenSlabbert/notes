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

        it('should update note body on text area change', function () {

            const newBody = 'a text change';
            const wrapper = mount(<Editor browserHistory={browserHistory}
                                          call={call}
                                          selectedNoteId={notes[0]._id}
                                          note={notes[0]}/>);

            wrapper.find('textarea').simulate('change', {
                target: {
                    value: newBody
                }
            });

            expect(wrapper.state('body')).toBe(newBody);
            expect(call).toHaveBeenCalledWith('notes.update', notes[0]._id,
                {body: newBody});
        });

        it('should update title', function () {

            const newTitle = 'a new title';
            const wrapper = mount(<Editor browserHistory={browserHistory}
                                          call={call}
                                          selectedNoteId={notes[0]._id}
                                          note={notes[0]}/>);

            wrapper.find('input').simulate('change', {
                target: {
                    value: newTitle
                }
            });

            expect(wrapper.state('title')).toBe(newTitle);
            expect(call).toHaveBeenCalledWith('notes.update', notes[0]._id,
                {title: newTitle});
        });

        it('should set state for new note', function () {

            const wrapper = mount(<Editor browserHistory={browserHistory}
                                          call={call}/>);

            wrapper.setProps({
                selectedNoteId: notes[0]._id,
                note: notes[0]
            });

            expect(wrapper.state('title')).toBe(notes[0].title);
            expect(wrapper.state('body')).toBe(notes[0].body);
        });

        it('should not set state if note prop not provided', function () {

            const wrapper = mount(<Editor browserHistory={browserHistory}
                                          call={call}/>);

            wrapper.setProps({
                selectedNoteId: notes[0]._id
            });

            expect(wrapper.state('title')).toBe('');
            expect(wrapper.state('body')).toBe('');
        });

    });
}

