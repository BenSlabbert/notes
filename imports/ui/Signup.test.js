import { Meteor } from 'meteor/meteor';
import React from 'react';
import expect from 'expect';
import { mount } from 'enzyme';

import { SignUp } from './Signup';

if (Meteor.isClient) {

    describe('Signup', function () {

        it('should show error message', function () {
            const error = 'an error message';
            const wrapper = mount(<SignUp createUser={() => { }} />);

            wrapper.setState({ error });

            const p = wrapper.find('p').text();
            expect(p).toBe(error);

            wrapper.setState({ error: '' })
            const numPs = wrapper.find('p').length;
            expect(numPs).toBe(0);
        });

        it('should call createUser with form data', function () {
            const email = 'ben@test.com';
            const password = 'password123';
            const spy = expect.createSpy();
            const wrapper = mount(<SignUp createUser={spy} />);

            wrapper.ref('email').node.value = email;
            wrapper.ref('password').node.value = password;
            wrapper.find('form').simulate('submit');

            expect(spy.calls[0].arguments[0]).toEqual({ email, password });
        });

        it('should set error if short password', function () {
            const email = 'ben@test.com';
            const password = 'pass';
            const spy = expect.createSpy();
            const wrapper = mount(<SignUp createUser={spy} />);

            wrapper.ref('email').node.value = email;
            wrapper.ref('password').node.value = password;
            wrapper.find('form').simulate('submit');

            expect(wrapper.state('error').length).toBeGreaterThan(0);
        });

        it('should set createUser callback error', function () {
            const password = 'password123';
            const reason = 'reason it failed';
            const spy = expect.createSpy();
            const wrapper = mount(<SignUp createUser={spy} />);

            wrapper.ref('password').node.value = password;
            wrapper.find('form').simulate('submit');

            // call error function with an argumment
            spy.calls[0].arguments[1]({ reason });
            expect(wrapper.state('error')).toBe(reason);

            // call error function with no argumment
            spy.calls[0].arguments[1]();
            expect(wrapper.state('error')).toBe('');
        });

    });
}