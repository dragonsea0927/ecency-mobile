/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import <Foundation/Foundation.h>

@class RCTBridge;

typedef NS_ENUM(NSUInteger, RCTFunctionType) {
  RCTFunctionTypeNormal,
  RCTFunctionTypePromise,
};

typedef NS_ENUM(NSUInteger, RCTNullability) {
  RCTNullabilityUnspecified,
  RCTNullable,
  RCTNonnullable,
};

@interface RCTMethodArgument : NSObject

@property (nonatomic, copy, readonly) NSString *type;
@property (nonatomic, readonly) RCTNullability nullability;
@property (nonatomic, readonly) BOOL unused;

@end

@interface RCTModuleMethod : NSObject

@property (nonatomic, copy, readonly) NSString *JSMethodName;
@property (nonatomic, readonly) Class moduleClass;
@property (nonatomic, readonly) SEL selector;
@property (nonatomic, readonly) RCTFunctionType functionType;

- (instancetype)initWithObjCMethodName:(NSString *)objCMethodName
                          JSMethodName:(NSString *)JSMethodName
                           moduleClass:(Class)moduleClass NS_DESIGNATED_INITIALIZER;

- (void)invokeWithBridge:(RCTBridge *)bridge
                  module:(id)module
               arguments:(NSArray *)arguments;

@end
