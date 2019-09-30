import expand from '../expand'

describe('Expanding style objects', () => {
  it('should expand properties in nested objects', () => {
    expect(
      expand({
        width: 200,
        border: '1px solid grey',
        padding: '20px 10px',
        ':hover': {
          borderWidth: '5px 2px 3px 4px',
          margin: '5px',
          height: 100,
        },
      })
    ).toMatchSnapshot()
  })

  it('should not throw on undefined values', () => {
    expect(
      expand({
        border: undefined,
        padding: null,
      })
    ).toMatchSnapshot()
  })

  it('should expand values in arrays', () => {
    expect(
      expand({
        numeralArray: [1, 2],
        padding: [1, '20px'],
        extend: [
          { padding: '10px' },
          { margin: 0 },
          { outline: [0, '10px solid red'] },
        ],
      })
    ).toMatchSnapshot()
  })
})
