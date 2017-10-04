import { Meteor } from 'meteor/meteor';
import React from 'react';
import expect from 'expect';
import { mount } from 'enzyme';

import { Login } from './Login';

if (Meteor.isClient) {

    describe('Login', function () {

        it('should show error message', function () {
            const error = 'an error message';
            const wrapper = mount(<Login loginWithPassword={() => { }} />);

            wrapper.setState({ error });

            const p = wrapper.find('p').text();
            expect(p).toBe(error);

            wrapper.setState({ error: '' })
            const numPs = wrapper.find('p').length;
            expect(numPs).toBe(0);
        });

        it('should call loginWithPassword with form data', function () {
            const email = 'ben@test.com';
            const password = 'password';
            const spy = expect.createSpy();
            const wrapper = mount(<Login loginWithPassword={spy} />);

            wrapper.ref('email').node.value = email;
            wrapper.ref('password').node.value = password;
            wrapper.find('form').simulate('submit');

            expect(spy.calls[0].arguments[0]).toEqual({ email });
            expect(spy.calls[0].arguments[1]).toBe(password);
        });

        it('should set loginWithPassword callback error', function () {
            const spy = expect.createSpy();
            const wrapper = mount(<Login loginWithPassword={spy} />);

            wrapper.find('form').simulate('submit');

            // call error function with an argumment
            spy.calls[0].arguments[2]({});
            expect(wrapper.state('error')).toNotBe('');

            // call error function with no argumment
            spy.calls[0].arguments[2]();
            expect(wrapper.state('error')).toBe('');
        });

    });
}