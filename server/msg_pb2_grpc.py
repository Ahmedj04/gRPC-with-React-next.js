# Generated by the gRPC Python protocol compiler plugin. DO NOT EDIT!
"""Client and server classes corresponding to protobuf-defined services."""
import grpc

import msg_pb2 as msg__pb2


class ChatServerStub(object):
    """Missing associated documentation comment in .proto file."""

    def __init__(self, channel):
        """Constructor.

        Args:
            channel: A grpc.Channel.
        """
        self.ChatStream = channel.unary_stream(
                '/ChatServer/ChatStream',
                request_serializer=msg__pb2.Empty.SerializeToString,
                response_deserializer=msg__pb2.ChatMessage.FromString,
                )
        self.SendChatMessage = channel.unary_unary(
                '/ChatServer/SendChatMessage',
                request_serializer=msg__pb2.ChatMessage.SerializeToString,
                response_deserializer=msg__pb2.Empty.FromString,
                )


class ChatServerServicer(object):
    """Missing associated documentation comment in .proto file."""

    def ChatStream(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def SendChatMessage(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')


def add_ChatServerServicer_to_server(servicer, server):
    rpc_method_handlers = {
            'ChatStream': grpc.unary_stream_rpc_method_handler(
                    servicer.ChatStream,
                    request_deserializer=msg__pb2.Empty.FromString,
                    response_serializer=msg__pb2.ChatMessage.SerializeToString,
            ),
            'SendChatMessage': grpc.unary_unary_rpc_method_handler(
                    servicer.SendChatMessage,
                    request_deserializer=msg__pb2.ChatMessage.FromString,
                    response_serializer=msg__pb2.Empty.SerializeToString,
            ),
    }
    generic_handler = grpc.method_handlers_generic_handler(
            'ChatServer', rpc_method_handlers)
    server.add_generic_rpc_handlers((generic_handler,))


 # This class is part of an EXPERIMENTAL API.
class ChatServer(object):
    """Missing associated documentation comment in .proto file."""

    @staticmethod
    def ChatStream(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_stream(request, target, '/ChatServer/ChatStream',
            msg__pb2.Empty.SerializeToString,
            msg__pb2.ChatMessage.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)

    @staticmethod
    def SendChatMessage(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/ChatServer/SendChatMessage',
            msg__pb2.ChatMessage.SerializeToString,
            msg__pb2.Empty.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)
