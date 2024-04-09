import { states } from './bearing';
import renderer, { ReactTestRendererJSON } from 'react-test-renderer';
import { BearingComponent } from './bearing-component';
describe('redux-bearing', () => {
    test('create bearing', () => {
        expect(states.num.val).toBe(0);
        expect(states.str.val).toBe('test bearing');
        expect(states.sub.num.val).toBe(1);
        expect(states.sub.str.val).toBe('sub bearing');
    });

    test('update bearing', () => {
        const listener = jest.fn((val) => val);

        states.num.on('update', listener);
        states.num.val = 3;

        expect(states.num.val).toBe(3);
        expect(listener.mock.calls).toHaveLength(1);
        expect(listener.mock.calls[0][0]).toBe(3);
    });

    // it worked in the browser, but not in the test
    it('renders correctly', () => {
        states.num.val = 0;
        const component = renderer.create(<BearingComponent /> as any);
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();

        renderer.act(() => {
            if(!tree) throw new Error('tree is null');
            (tree as ReactTestRendererJSON).props.onClick();
        });
        tree = component.toJSON();
        expect(tree).toMatchSnapshot();

        renderer.act(() => {
            if(!tree) throw new Error('tree is null');
            (tree as ReactTestRendererJSON).props.onClick();
        });
        tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});