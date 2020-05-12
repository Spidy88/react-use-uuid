jest.mock('uuid/v4');

import React from 'react';
import { render } from '@testing-library/react';
import uuidV4 from 'uuid/v4';
import useId from './index';

function Fake(props) {
    let id = useId('v4', { testProp: 'success' });

    return (
        <div id={id} {...props} />
    );
}

describe('useId', function() {
    beforeEach(() => {
        uuidV4
            .mockReturnValueOnce('v4_1')
            .mockReturnValueOnce('v4_2');
    });

    afterEach(() => {
        uuidV4.mockClear();
    });

    it('should generate the same id for a component over multiple renders', function() {
        let { getByTestId, rerender } = render(
            <Fake data-testid="test" />
        );
        let firstId = getByTestId('test').id;

        expect(uuidV4).toHaveBeenCalledTimes(1);
        expect(firstId).toEqual('v4_1');

        rerender(
            <Fake data-testid="test" />
        );
        let secondId = getByTestId('test').id;

        expect(uuidV4).toHaveBeenCalledTimes(1);
        expect(secondId).toEqual('v4_1');
    });

    it('should generate unique ids for different components', function() {
        let { getByTestId, rerender } = render(
            <div>
                <Fake data-testid="test1" />
                <Fake data-testid="test2" />
            </div>
        );
        let firstId1 = getByTestId('test1').id;
        let firstId2 = getByTestId('test2').id;

        expect(uuidV4).toHaveBeenCalledTimes(2);
        expect(firstId1).toMatch(/v4_[12]/);
        expect(firstId2).toMatch(/v4_[12]/);
        expect(firstId1).not.toEqual(firstId2);

        rerender(
            <div>
                <Fake data-testid="test1" />
                <Fake data-testid="test2" />
            </div>
        );

        let secondId1 = getByTestId('test1').id;
        let secondId2 = getByTestId('test2').id;

        expect(uuidV4).toHaveBeenCalledTimes(2);
        expect(secondId1).toEqual(firstId1);
        expect(secondId2).toEqual(firstId2);
    });

    it('should pass through props to uuid', () => {
        render(
            <Fake data-testid="test" />
        );

        expect(uuidV4).toHaveBeenCalledTimes(1);
        expect(uuidV4).toHaveBeenCalledWith({ testProp: 'success' });
    });
});
