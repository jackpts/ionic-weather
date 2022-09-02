import { plainToInstance } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Constructor } from '../models';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const MapTo =
  // eslint-disable-next-line @typescript-eslint/naming-convention
  <TargetType>(TargetClass: Constructor<TargetType>) =>
    <MethodType extends (...args: unknown[]) => Observable<TargetType>>(
      _target: unknown,
      _methodName: string | symbol,
      descriptor: TypedPropertyDescriptor<MethodType>,
    ) => {
      const originalMethod = descriptor.value;

      descriptor.value = function(...args: unknown[]) {
        const toClass = (dto) => plainToInstance(TargetClass, dto, { excludeExtraneousValues: true });

        return originalMethod.apply(this, args).pipe(map(toClass));
      } as MethodType;

      return descriptor;
    };
