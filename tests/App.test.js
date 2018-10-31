const Reviews = require('../client/App.jsx');
const Enzyme = require('enzyme');
const Adapter = ('enzyme-adapter-react-16');

Enzyme.configure({ adapter: new Adapter() });

jest.mock();