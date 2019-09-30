import expandWithMerge from '../expandWithMerge'

describe('Expanding (with merge) style objects', () => {
  it('should expand and merge properties in nested objects', () => {
    expect(
      expandWithMerge({
        padding: '20px 10px',
        paddingBottom: '15px',
        ':hover': {
          borderWidth: '5px 2px 3px 4px',
          borderBottomWidth: '10px',
        },
      })
    ).toMatchSnapshot()
  })

  it('should expand values in arrays', () => {
    expect(
      expandWithMerge({
        numeralArray: [1, 2],
        padding: [1, '20px'],
        extend: [
          { padding: '10px' },
          { margin: 0 },
          { outline: [0, '10px solid red'], outlineColor: 'green' },
        ],
      })
    ).toMatchSnapshot()
  })

  it('should expand and merge properties with non-undefined values', () => {
    expect(
      expandWithMerge({
        padding: '20px 10px',
        paddingBottom: 0,
        paddingLeft: null,
        paddingRight: undefined,
      })
    ).toMatchSnapshot()
  })

  it('should expand and merge border properties in nested objects', () => {
    expect(
      expandWithMerge({
        border: '1px solid grey',
        borderLeft: '2px dotted black',
      })
    ).toMatchSnapshot()
  })

  it('should expand and merge multiple border properties in nested objects', () => {
    expect(
      expandWithMerge({
        border: '1px solid grey',
        borderLeft: '2px dotted black',
        borderWidth: '5px 6px 7px 8px',
        borderLeftWidth: '10px',
      })
    ).toMatchSnapshot()
  })
})
