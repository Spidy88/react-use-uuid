import React from 'react';
import { render } from '@testing-library/react';
import useId from './index';

function Fake({ testId }) {
    let id = useId();

    return (
        <div id={id} data-testid={testId} />
    );
}

describe('useId', function() {
    it('should generate the same id for a component over multiple renders', function() {
        let { getByTestId, rerender } = render(
            <Fake testId="test" />
        );

        let firstId = getByTestId("test").id;

        rerender(
            <Fake testId="test" />
        );

        let secondId = getByTestId("test").id;

        expect(firstId).toEqual(secondId);
    });

    it('should generate unique ids for different components', function() {
        let { getByTestId, rerender } = render(
            <div>
                <Fake testId="test1" />
                <Fake testId="test2" />
            </div>
        );

        let firstId1 = getByTestId("test1").id;
        let firstId2 = getByTestId("test2").id;

        expect(firstId1).not.toEqual(firstId2);

        rerender(
            <div>
                <Fake testId="test1" />
                <Fake testId="test2" />
            </div>
        );

        let secondId1 = getByTestId("test1").id;
        let secondId2 = getByTestId("test2").id;

        expect(firstId1).toEqual(secondId1);
        expect(firstId2).toEqual(secondId2);
    });
});