import expandProperty from '../expandProperty'

describe('Expanding property values', () => {
  it('should expand correctly', () => {
    expect(expandProperty('padding', '15px 20px 5px')).toMatchSnapshot()
  })
})
