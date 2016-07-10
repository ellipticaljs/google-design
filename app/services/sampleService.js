
import elliptical from '../references/elliptical';
import container from '../dependencies/container';

class SampleService extends elliptical.Service {

}


container.mapType('SampleService',SampleService,'$SampleProvider');