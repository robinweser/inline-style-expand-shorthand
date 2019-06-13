import expandProperty from '../expandProperty'

describe('Expanding property values', () => {
  it('should expand padding/margin correctly', () => {
    expect(expandProperty('padding', '15px 20px 5px 10px')).toMatchSnapshot()
    expect(expandProperty('padding', '15px 20px 5px')).toMatchSnapshot()
    expect(expandProperty('padding', '15px 20px')).toMatchSnapshot()
    expect(expandProperty('padding', '15px')).toMatchSnapshot()
    expect(expandProperty('padding', 0)).toMatchSnapshot()
    expect(expandProperty('padding', '0')).toMatchSnapshot()
    expect(expandProperty('margin', '15px 20px 5px 10px')).toMatchSnapshot()
    expect(
      expandProperty('padding', 'calc(20px - 15px) 10px calc(100% - 5px)')
    ).toMatchSnapshot()
    expect(
      expandProperty('margin', '15px var(--foo) 5px var(--bar)')
    ).toMatchSnapshot()
    expect(
      expandProperty(
        'padding',
        '15px calc(1em * var(--foo)) 5px calc(10px + var(--bar))'
      )
    ).toMatchSnapshot()
    expect(
      expandProperty(
        'padding',
        '15px calc(1em * (2 * var(--foo))) 5px calc(10px + (var(--bar) +      4em     ))'
      )
    ).toMatchSnapshot()
  })

  it('should expand flex correctly', () => {
    expect(expandProperty('flex', '0 1 auto')).toMatchSnapshot()
    expect(expandProperty('flex', '2 1 50%')).toMatchSnapshot()
    expect(expandProperty('flex', '3 1 20px')).toMatchSnapshot()
    expect(expandProperty('flex', '3 20px')).toMatchSnapshot()
    expect(expandProperty('flex', '20px 1')).toMatchSnapshot()
    expect(expandProperty('flex', '20px 1 0')).toMatchSnapshot()
    expect(expandProperty('flex', '1 20px 0')).toMatchSnapshot()
    expect(expandProperty('flex', '1 2 var(--foo)')).toMatchSnapshot()
    expect(
      expandProperty('flex', '1 2 calc(100% - var(--bar))')
    ).toMatchSnapshot()
  })

  it('should expand borders/outline correctly', () => {
    expect(expandProperty('border', '1px solid grey')).toMatchSnapshot()
    expect(
      expandProperty('border', 'calc(10px + 1em) solid grey')
    ).toMatchSnapshot()
    expect(
      expandProperty('border', 'calc(var(--foo) + 1em) solid grey')
    ).toMatchSnapshot()
    expect(expandProperty('border', 'solid 1px grey')).toMatchSnapshot()
    expect(
      expandProperty('border', 'solid calc(10px + 1em) grey')
    ).toMatchSnapshot()
    expect(
      expandProperty('border', 'solid calc(var(--foo) + 1em) grey')
    ).toMatchSnapshot()
    expect(expandProperty('border', 'solid grey 1px')).toMatchSnapshot()
    expect(
      expandProperty('border', 'solid grey calc(10px + 1em)')
    ).toMatchSnapshot()
    expect(
      expandProperty('border', 'solid grey calc(var(--foo) + 1em)')
    ).toMatchSnapshot()

    expect(expandProperty('borderLeft', '1px solid grey')).toMatchSnapshot()

    expect(expandProperty('borderTop', '1px solid grey')).toMatchSnapshot()

    expect(expandProperty('borderWidth', '1px 5px 3px 2px')).toMatchSnapshot()
    expect(expandProperty('borderWidth', '1px 5px 3px')).toMatchSnapshot()

    expect(expandProperty('outline', '1px solid grey')).toMatchSnapshot()
    expect(
      expandProperty('outline', 'calc(100px + 1em) solid grey')
    ).toMatchSnapshot()
    expect(
      expandProperty('outline', 'calc(100px + var(--foo)) solid grey')
    ).toMatchSnapshot()

    expect(expandProperty('borderLeft', 0)).toMatchSnapshot()
    expect(
      expandProperty('borderLeft', 'calc(-1 * var(--bar))')
    ).toMatchSnapshot()
  })
})
